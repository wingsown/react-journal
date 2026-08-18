import { useEffect, useState } from "react"
import  { useParams, useNavigate } from "react-router-dom"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { BlogPost } from "../types/blogData"
import "../assets/css/List.css"
import { groupByRegion } from "../utils/groupByRegion"
import Folder from "./Folder"

const Region: React.FC = () => {

  const [groupedRegions, setGroupedRegions] = useState<Record<string, BlogPost[]>>({})
  const [clickedRegion, setClickedRegion] = useState<string | null>(null)
  const { country } = useParams()
  const navigate = useNavigate()
  
useEffect(() => {
    const fetchPosts = async () => {
        const q = query(collection(db, "blogs"), orderBy("region", "asc"))
        const snapshot = await getDocs(q)
        const posts: BlogPost[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as BlogPost),
          id: doc.id
        }))

        const filteredPosts = posts.filter(post => post.country === country)

        const grouped = groupByRegion(filteredPosts)

        const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
          return a.localeCompare(b)
        })

        setGroupedRegions(Object.fromEntries(sortedEntries))
    }

    fetchPosts()
  })


  const handleFolderClick = (region: string) => {
    setClickedRegion(region)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="toggle-container">
          <h2>Archives</h2>
        </div>
        <div className="folder-grid">
            {Object.entries(groupedRegions).map(([region, posts], index) => (
              <Folder
                key={region}
                label={region}
                posts={posts}
                onClickLabel={handleFolderClick}
                clickedLabel={clickedRegion}
                type="region"
                className="folder-appear"
                style={{ animationDelay: `${index * 0.1}s` }}
                basePath={`/country/${country}/region`}
              />
            ))
            }
          </div>
          <div className="archives-button-wrapper left">
            <button 
            className="back-button"
            onClick={() => navigate(`/country`)}
            >Back</button>
          </div>
      </div>
    </section>
    
  )
}

export default Region