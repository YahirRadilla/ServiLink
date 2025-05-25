
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { StyleSheet } from "react-native";

type Props = {
    uri: string;
};

const VideoModalPlayer = ({ uri }: Props) => {
    const player = useVideoPlayer(uri, (player) => {
        player.loop = false;
        player.play();
    });

    return (
        <VideoView
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            style={styles.video}
        />
    );
};

const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: "60%",
    },
});

export default VideoModalPlayer;
