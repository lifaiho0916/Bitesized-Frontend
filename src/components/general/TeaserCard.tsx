import { useState, useRef } from "react"
import ReactPlayer from "react-player"
import { PlayIcon } from "../../assets/svg"
import "../../assets/styles/TeaserCardStyle.scss"

const TeaserCard = (props: any) => {
  const { cover, teaser, type, border } = props
  const [play, setPlay] = useState(false)
  const playerRef = useRef<ReactPlayer | null>(null)

  return (
    <div className="teaser-wrapper"
      onClick={() => {
        if (play) {
          setPlay(false)
          playerRef.current?.seekTo(0)
        }
      }}
    >
      {(cover && !play) &&
        <div className="cover-image" style={{ borderRadius: border ? border : '0px' }}>
          <img
            src={cover}
            alt="cover Image"
            width={'100%'}
          />
        </div>
      }
      {play &&
        <>
          <ReactPlayer
            className="react-player"
            style={{ borderRadius: border ? border : '0px' }}
            ref={playerRef}
            url={teaser}
            playing={play}
            playsinline={true}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload noremoteplayback noplaybackrate',
                  disablePictureInPicture: true,
                }
              }
            }}
            controls
            onProgress={(progress) => {
              if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
            }}
          />
        </>
      }
      {!play &&
        <div className={`play-icon-${type}`} onClick={() => { setPlay(true) }}>
          <PlayIcon color="white" />
        </div>
      }
    </div>
  )
}

export default TeaserCard