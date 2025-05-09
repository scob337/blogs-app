interface ILike {
  id: string;
  userId: string;
  postId: string;
  commentId?: string | null;
  createdAt: Date;
  user?: {
    id: string;
    fName?: string;
    img?: string;
  };
}

export default ILike;