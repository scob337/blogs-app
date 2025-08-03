 interface IPost {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    fName: string;
    lName?: string;
    img: string;
    email?: string;
  };
  category?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  views?: number;
}

export default IPost