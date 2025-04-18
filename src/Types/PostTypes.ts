 interface IPost {
    id: string
    title: string
    content: string
    thumbnail: string
    authorId: string
    createdAt: string
    updatedAt: string
    author?: {
      fName: string
      img: string
    }
    category?: string
  }

export default IPost