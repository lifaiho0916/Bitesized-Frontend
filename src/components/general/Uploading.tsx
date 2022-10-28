import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/UploadingStyle.scss"

const Uploading = () => {
  const loadState = useSelector((state: any) => state.load)
  const biteState = useSelector((state: any) => state.bite)
  const { bite } = biteState
  const { uploadProcess } = loadState
  const [index, setIndex] = useState(Math.floor(Math.random() * (CONSTANT.UPLOADING_LETTERS.length - 1)))

  const percent = useMemo(() => {
    const len = bite.videos.length === 0 ? 1 : bite.videos.length * 2
    let sum = 0
    uploadProcess.forEach((process: any) => {
      sum += process
    })
    return Math.floor(sum / len)
  }, [uploadProcess, bite])

  useEffect(() => {
    const timerId = setInterval(() => {
      setIndex(Math.floor(Math.random() * (CONSTANT.UPLOADING_LETTERS.length - 1)))
    }, 5000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
    <div className="uploading-wrapper">
      <div className="uploading">
        <div className="percentage">
          <div className="real-value"
            style={{
              background: `conic-gradient(
                #EFA058 ${percent}%,
                #E1E0DF ${percent}%
              )`
            }}>
            <div className="center-circle">
              <span>{percent}%</span>
            </div>
          </div>
        </div>
        <div className="uploading-description">
          <span>Your Bite is under processing, please wait</span>
        </div>
        <div className="said-letter">
          <div className="letter">
            <span>{CONSTANT.UPLOADING_LETTERS[index].letter}</span>
          </div>
          <div className="owner">
            <span>{CONSTANT.UPLOADING_LETTERS[index].owner}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Uploading
