import Namepanel from "./Namepanel"
import TalkBody from "./TalkBody"
import TypePanel from "./TypePanel"
export default function Talk() {
  return (<div className="allContainter">
    <Namepanel />
    <TalkBody />
    <TypePanel  />
  </div>)
}