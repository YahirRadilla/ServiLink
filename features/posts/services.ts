import { TPost } from '@/entities/posts';
import { db } from '@/lib/firebaseConfig';
import { postToEntity, RawPostData } from '@/mappers/postToEntity';
import { collection, onSnapshot } from 'firebase/firestore';

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
