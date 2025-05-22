import { TPost } from '@/entities/posts';
import { db } from '@/lib/firebaseConfig';
import { storage } from '@/lib/firebaseStorageConfig';
import { postToEntity, RawPostData } from '@/mappers/postToEntity';
import { addDoc, collection, doc, DocumentSnapshot, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, Timestamp, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const listenToPosts = (onUpdate: (posts: TPost[]) => void) => {
    const postsRef = collection(db, 'posts');

    const unsubscribe = onSnapshot(postsRef, async (snapshot) => {
        try {

            const postPromises = snapshot.docs.map((doc) =>
                postToEntity(doc.id, doc.data() as RawPostData)
            );


            const posts = await Promise.all(postPromises);

            onUpdate(posts);
        } catch (error) {
            console.error('Error al mapear los posts:', error);
        }
    });

    return unsubscribe;
};

const PAGE_SIZE = 5;

type Filters = {
    colonia?: string;
    servicio?: string;
    ordenar?: "Recientes" | "Más Antigüos";
};

export const fetchPostsPage = async (
    filters: Filters,
    lastVisible?: DocumentSnapshot
): Promise<{ posts: TPost[]; last: DocumentSnapshot | null }> => {
    try {
        const postsRef = collection(db, "posts");

        let constraints: any[] = [];

        // Filtros
        if (filters.colonia) {
            constraints.push(where("address.neighborhood", "==", filters.colonia));
        }

        if (filters.servicio) {
            constraints.push(where("service", "==", filters.servicio));
        }

        // Orden
        if (filters.ordenar === "Más Antigüos") {
            constraints.push(orderBy("created_at", "asc"));
        } else {
            constraints.push(orderBy("created_at", "desc")); // default
        }

        // Paginación
        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        constraints.push(limit(PAGE_SIZE));

        const q = query(postsRef, ...constraints);
        const snapshot = await getDocs(q);

        const postPromises = snapshot.docs.map((doc) =>
            postToEntity(doc.id, doc.data() as RawPostData)
        );

        const posts = await Promise.all(postPromises);
        const last = snapshot.docs[snapshot.docs.length - 1] ?? null;

        return { posts, last };
    } catch (error) {
        console.error("🔥 Error al paginar posts:", error);
        return { posts: [], last: null };
    }
};


export const getPostById = async (id: string): Promise<TPost | null> => {
    try {
        const postRef = doc(db, "posts", id);

        const postSnapshot = await getDoc(postRef);

        if (!postSnapshot.exists()) {
            return null;
        }

        const post = await postToEntity(postSnapshot.id, postSnapshot.data() as RawPostData);
        return post;
    } catch (error) {
        console.error("Error al obtener el post:", error);
        return null;
    }
};

export const createPost = async (post: any, providerId: string): Promise<string | null> => {
    try {
        const postRef = collection(db, 'posts');
        const imageUrls: string[] = [];

        for (const [index, uri] of post.images.entries()) {
            if (!uri || typeof uri !== 'string') {
                console.warn(`URI inválida en la imagen ${index}:`, uri);
                continue;
            }

            const response = await fetch(uri);
            const blob = await response.blob();

            const imageRef = ref(storage, `posts/${Date.now()}_${index}.jpg`);
            await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(imageRef);
            imageUrls.push(downloadURL);
        }


        const postToDatabase = {
            title: post.title,
            description: post.description,
            valoration: 0,
            images: imageUrls,
            post_type: post.postType,
            status: true,
            min_price: Number(post.minPrice),
            max_price: Number(post.maxPrice),
            provider_id: doc(db, 'providers', providerId),
            address: {
                neighborhood: post.neighborhood,
                street_address: post.streetAddress,
                zipcode: post.zipCode,
                latitude: post.location.latitude,
                longitude: post.location.longitude
            },
            service: post.service,
            created_at: Timestamp.fromDate(new Date()),
        }

        const newDoc = await addDoc(postRef, postToDatabase);
        return newDoc.id;
    } catch (error) {
        console.error('Error al crear el post:', error);
        return null;
    }
};


export const getPostsByProviderRef = async (
    providerId: string
): Promise<TPost[]> => {
    try {
        const postsRef = collection(db, "posts");
        const providerRef = doc(db, "providers", providerId);

        const q = query(postsRef, where("provider_id", "==", providerRef));
        const snapshot = await getDocs(q);

        const postPromises = snapshot.docs.map((doc) =>
            postToEntity(doc.id, doc.data() as RawPostData)
        );

        const posts = await Promise.all(postPromises);
        return posts;
    } catch (error) {
        console.error("Error al obtener posts por providerId:", error);
        return [];
    }
};