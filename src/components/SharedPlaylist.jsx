import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const SharedPlaylist = ({ currentUser }) => {
  const [room, setRoom] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [playlist, setPlaylist] = useState([]);

  const db = firebase.firestore();

  useEffect(() => {
    const roomName = 'cool room';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzk2ZmExOTQ1N2ZkZTQ1YTkzOGNiY2M3MWZhODVkYTg0LTE2NzY2NTIxMjIiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJ1c2VyIiwidmlkZW8iOnsicm9vbSI6ImNvb2wgcm9vbSJ9fSwiaWF0IjoxNjc2NjUyMTIyLCJleHAiOjE2NzY2NTU3MjIsImlzcyI6IlNLOTZmYTE5NDU3ZmRlNDVhOTM4Y2JjYzcxZmE4NWRhODQiLCJzdWIiOiJBQ2Y5ZDc5MDZlMzM2NjA4YzUyNjEwZDI5ZWE4ZWJkNTc2In0.E7WYHWFTyWN8jDam2G3gxT1EYY0ZevlazyJE0X01gj0';

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participant => {
        setParticipant(participant);
      });
    });

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Load the playlist from Firebase
    db.collection('playlists').doc('my-playlist').get().then(doc => {
      if (doc.exists) {
        setPlaylist(doc.data().songs);
      }
    });
  }, [db]);

  useEffect(() => {
    // Play the current song when it changes
    if (playlist.length > 0) {
      const currentSong = playlist[0];
      console.log(currentSong);
      const audio = new Audio(currentSong.url);
      console.log(audio);
      audio.play();

      // Synchronize playback with other participants
      if (participant) {
        const track = new Video.LocalDataTrack();
        participant.publishTrack(track);

        let lastPosition = 0;
        setInterval(() => {
          const position = audio.currentTime || 0;
          if (position !== lastPosition) {
            track.send({ position });
            lastPosition = position;
          }
        }, 100);

        room.on('trackPublished', publication => {
          if (publication.track === track) {
            publication.track.on('message', data => {
              const { position } = JSON.parse(data);
              if (position !== lastPosition) {
                audio.currentTime = position;
                lastPosition = position;
              }
            });
          }
        });
      }
    }
  }, [participant, playlist]);

  return (
    <div>
      <h1>Shared Playlist</h1>
      <ul>
        {playlist.map(song => (
          <li key={song.url}>{song.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SharedPlaylist;
