import { emptyConversation, TConversation } from "../conversations/index";
import { emptyUser, TUser } from "../users/index";

export type TTypeMessage = 'text' | 'image' | 'video';

export type TMessage = {
  id: string
  sender: TUser
  conversation: TConversation
  type: TTypeMessage
  content: any
  seen: boolean
  date: Date
};

export const emptyMessage: TMessage = {
  id: '',
  sender: emptyUser,
  conversation: emptyConversation,
  type: 'text',
  content: '',
  seen: false,
  date: new Date(),
}

