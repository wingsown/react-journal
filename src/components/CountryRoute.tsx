import { useParams } from "react-router-dom"
import List from "./List"
import Region from "./Region"

const CountryRoute: React.FC = () => {
  const { country } = useParams()

  if (country === "PH 🇵🇭") {
    return <Region />
  }

  return <List />
}

export default CountryRoute