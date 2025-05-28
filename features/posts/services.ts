import { TPost } from '@/entities/posts';
import { db } from '@/lib/firebaseConfig';
import { storage } from '@/lib/firebaseStorageConfig';
import { postToEntity, RawPostData } from '@/mappers/postToEntity';
import { addDoc, collection, deleteDoc, doc, DocumentSnapshot, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, Timestamp, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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
    providerId: string,
    lastVisible?: DocumentSnapshot
): Promise<{ posts: TPost[]; last: DocumentSnapshot | null }> => {
    try {
        const postsRef = collection(db, "posts");
        const providerRef = doc(db, "providers", providerId);
        const constraints: any[] = [
            where("provider_id", "==", providerRef),
            orderBy("created_at", "desc"),
            limit(PAGE_SIZE),
        ];

        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        const q = query(postsRef, ...constraints);
        const snapshot = await getDocs(q);

        const postPromises = snapshot.docs.map((doc) =>
            postToEntity(doc.id, doc.data() as RawPostData)
        );

        const posts = await Promise.all(postPromises);
        const last = snapshot.docs[snapshot.docs.length - 1] ?? null;

        return { posts, last };
    } catch (error) {
        console.error("Error al obtener posts por providerId:", error);
        return { posts: [], last: null };
    }
};

export const deletePost = async (postId: string): Promise<boolean> => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            console.warn("Post no encontrado:", postId);
            return false;
        }

        const data = postSnap.data();
        const imageUrls: string[] = data.images || [];

        await Promise.all(
            imageUrls.map(async (url) => {
                try {
                    const pathStart = url.indexOf("/o/") + 3;
                    const pathEnd = url.indexOf("?alt=");
                    const filePath = decodeURIComponent(url.substring(pathStart, pathEnd));
                    const imageRef = ref(storage, filePath);
                    await deleteObject(imageRef);
                } catch (err) {
                    console.warn("No se pudo borrar una imagen del post:", err);
                }
            })
        );

        const proposalsRef = collection(db, "proposals");
        const proposalsQuery = query(proposalsRef, where("post_id", "==", postRef), where("accept_status", "==", "pending"));
        const proposalsSnap = await getDocs(proposalsQuery);

        const rejectOps = proposalsSnap.docs.map((docSnap) =>
            updateDoc(docSnap.ref, { accept_status: "rejected" })
        );
        await Promise.all(rejectOps);

        const reviewsRef = collection(db, "reviews");
        const reviewsQuery = query(reviewsRef, where("post_id", "==", postRef));
        const reviewsSnap = await getDocs(reviewsQuery);

        const deleteReviewOps = reviewsSnap.docs.map(async (reviewDoc) => {
            const reviewData = reviewDoc.data();
            const reviewImageUrls: string[] = reviewData.images || [];

            await Promise.all(
                reviewImageUrls.map(async (url) => {
                    try {
                        const pathStart = url.indexOf("/o/") + 3;
                        const pathEnd = url.indexOf("?alt=");
                        const filePath = decodeURIComponent(url.substring(pathStart, pathEnd));
                        const imageRef = ref(storage, filePath);
                        await deleteObject(imageRef);
                    } catch (err) {
                        console.warn("No se pudo borrar una imagen de review:", err);
                    }
                })
            );

            return deleteDoc(reviewDoc.ref);
        });

        await Promise.all(deleteReviewOps);

        await deleteDoc(postRef);

        return true;
    } catch (error) {
        console.error("🔥 Error al eliminar post, propuestas y reviews:", error);
        return false;
    }
};
