import React, { useState, useRef } from "react";
import { AppHeader, WelcomeScreen } from "@/features/landing";
import {
  EditorWorkspace,
  useVideoUpload,
  useSubtitles,
} from "@/features/subtitles";
import { useKeyboardShortcuts } from "@/features/subtitles/hooks/useKeyboardShortcuts";

function Home() {
  // State for pro mode toggle
  const [isPro, setIsPro] = useState(false);

  // Video upload and playback state
  const { videoUrl, isUploading, isPortrait, uploadVideo } = useVideoUpload();

  // Video player reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current video playback time
  const [currentTime, setCurrentTime] = useState(0);

  // Subtitle state and handlers
  const {
    subtitles,
    currentSubtitleId,
    wordsPerSubtitle,

    handleImportSRT,
    updateSubtitle,
    deleteSubtitle,
    downloadSRT,
    addNewSubtitle,
    mergeSubtitles,
    splitSubtitle,
    handleTimeUpdate,
    handleReset,
    handleSplitAllSubtitles,
    setWordsPerSubtitle,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSubtitles(isPro);

  // Handle time updates from video player
  const onTimeUpdate = (time: number) => {
    setCurrentTime(time);
    handleTimeUpdate(time);
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    videoRef,
    subtitles,
    currentSubtitleId,
    onAddSubtitle: addNewSubtitle,
    onSplitSubtitle: splitSubtitle,
    onMergeSubtitle: mergeSubtitles,
    onDeleteSubtitle: deleteSubtitle,
    onDownloadSRT: downloadSRT,
    isPro,
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader isPro={isPro} setIsPro={setIsPro} />

      <main className="container mx-auto px-1 py-1">
        {!videoUrl ? (
          <WelcomeScreen
            isUploading={isUploading}
            isPro={isPro}
            fileInputRef={fileInputRef}
          />
        ) : (
          <EditorWorkspace
            videoUrl={videoUrl}
            subtitles={subtitles}
            currentTime={currentTime}
            currentSubtitleId={currentSubtitleId}
            isPortrait={isPortrait}
            wordsPerSubtitle={wordsPerSubtitle}
            isPro={isPro}
            fileInputRef={fileInputRef}
            videoRef={videoRef}
            onTimeUpdate={onTimeUpdate}
            onImportSRT={handleImportSRT}
            onUpdateSubtitle={updateSubtitle}
            onAddSubtitle={addNewSubtitle}
            onSplitSubtitle={splitSubtitle}
            onMergeSubtitle={mergeSubtitles}
            onSplitAllSubtitles={handleSplitAllSubtitles}
            onDeleteSubtitle={deleteSubtitle}
            onDownloadSRT={downloadSRT}
            onReset={handleReset}
            setWordsPerSubtitle={setWordsPerSubtitle}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={uploadVideo}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

export default Home;
