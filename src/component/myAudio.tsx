import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music } from 'lucide-react';


interface Props {
    src: string;
    title?: string;
}


/**
 * AudioPlayer 元件
 * @param {string} src - 音檔網址
 * @param {string} title - 顯示標題 (選填)
 */
const MyAudioPlayer: React.FC<Props> = ({ src, title = "音訊播放器" }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // 切換播放與暫停
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error("播放被阻擋:", err));
        }
    };

    // 重新播放
    const resetAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        setProgress(0);
        setCurrentTime(0);
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.error("播放被阻擋:", err));
    };

    // 初始化音檔長度
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // 更新進度與時間
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const cur = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setCurrentTime(cur);
            if (dur) {
                setProgress((cur / dur) * 100);
            }
        }
    };

    // 格式化時間 (秒 -> mm:ss)
    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 拖動進度條
    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPercent = parseFloat(e.target.value);
        if (audioRef.current && audioRef.current.duration) {
            const newTime = (newPercent / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(newPercent);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-2 w-full max-w-sm">
            {/* <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                    <Music size={20} />
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-semibold text-gray-800 truncate text-sm">{title}</h3>
                    <p className="text-xs text-gray-400">MP3 Audio</p>
                </div>
            </div> */}

            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
            />

            {/* 進度條 */}
            {/* <div className="space-y-1 mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div> */}

            {/* 控制按鈕 */}
            <div className="flex items-center justify-between">
                <button
                    onClick={resetAudio}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title="重播"
                >
                    <RotateCcw size={18} />
                </button>

                <button
                    onClick={togglePlay}
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md active:scale-90"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor"  />}
                </button>

                {/* <div className="p-2 text-gray-300">
                    <Volume2 size={18} />
                </div> */}

                <div className=' pl-2  '>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleProgressChange}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>


            </div>
        </div>
    );
};
 

export default MyAudioPlayer;