import { TPost } from '@/entities/posts';
import { db } from '@/lib/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export const listenToPosts = (onUpdate: (posts: TPost[]) => void) => {
    const postsRef = collection(db, 'posts');

    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
        const posts: TPost[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as TPost),
            id: doc.id,
        }));

        onUpdate(posts);
    });

    return unsubscribe;
};
