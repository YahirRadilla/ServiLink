import { TPost } from '@/entities/posts';
import { db } from '@/lib/firebaseConfig';
import { storage } from '@/lib/firebaseStorageConfig';
import { postToEntity, RawPostData } from '@/mappers/postToEntity';
import { addDoc, collection, doc, onSnapshot, Timestamp } from 'firebase/firestore';
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
        return null;
    } catch (error) {
        console.error('Error al crear el post:', error);
        return null;
    }
};
