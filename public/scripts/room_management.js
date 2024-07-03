
const distant_video_display = document.getElementById('distant_video_display');
const client_video_display = document.getElementById('client_video_display');
const mic_toggle_btn = document.getElementById("mic_toggle_btn");
const camera_toggle_btn = document.getElementById("camera_toggle_btn");
const camera_select_dropdown = document.getElementById("camera_select_dropdown");
const share_screen_btn = document.getElementById("share_screen_btn");

const iceConfiguration = {}

iceConfiguration.iceServers = [
   {
     urls: 'stun:stun1.l.google.com:19302'
   }
];

const rtcPeerConnection = new RTCPeerConnection(iceConfiguration);

let media_stream;

let is_client_streaming_first_time = true;

const room_io = io('/room');

let client_media_status = {
    is_muted: true,
    is_camera_off: true
}

let client_screen_sharing = false;


mic_toggle_btn.addEventListener('click', () => {
    if (client_media_status.is_muted) {
        mic_toggle_btn.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
        client_media_status.is_muted = false;
        media_stream.getAudioTracks().forEach(track => {
            track.enabled = true;
        });
    } else {
        mic_toggle_btn.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
        client_media_status.is_muted = true;
        media_stream.getAudioTracks().forEach(track => {
            track.enabled = false;
        });
    }
});

camera_toggle_btn.addEventListener('click', () => {
    if (client_media_status.is_camera_off) {
        camera_toggle_btn.innerHTML = `<i class="fa-solid fa-video"></i>`;
        client_media_status.is_camera_off = false;
        media_stream.getVideoTracks().forEach(track => {
            track.enabled = true;
        });
    } else {
        camera_toggle_btn.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
        client_media_status.is_camera_off = true;
        media_stream.getVideoTracks().forEach(track => {
            track.enabled = false;
        });
    }
});

const get_client_video_stream = (constraints) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                media_stream = stream;
                client_video_display.srcObject = media_stream;

                attach_track_to_peer(media_stream);

                // disable mic & cam on first time joining
                if (is_client_streaming_first_time) {
                    media_stream.getAudioTracks().forEach(track => {
                        track.enabled = false;
                    });
                    media_stream.getVideoTracks().forEach(track => {
                        track.enabled = false;
                    });
                    is_client_streaming_first_time = false;
                }

                client_video_display.addEventListener('loadedmetadata', () => {
                    client_video_display.play().then(() => {
                    }).catch(() => {
                        const noVidStartToast = Swal.mixin({
                            toast: true,
                            position: "top-start",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true
                        });
                        noVidStartToast.fire({
                            icon: "error",
                            title: "Cannot start video playback!"
                        });
                    });
                });
            })
            .catch(() => {
                const noSupportToast = Swal.mixin({
                    toast: true,
                    position: "top-start",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                noSupportToast.fire({
                    icon: "error",
                    title: "Cannot access media devices!"
                });
            });
    } else {
        const noMediaSupportToast = Swal.mixin({
            toast: true,
            position: "top-start",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        noMediaSupportToast.fire({
            icon: "error",
            title: "Your browser does not support media devices!"
        });
    }
}

const create_rtc_offer = () => {
    rtcPeerConnection.createOffer().then(offer => {
        rtcPeerConnection.setLocalDescription(offer);
        // sending offer through socket
        room_io.emit('client_send_rtc_offer', offer, client_room_id);

    }).catch(() => {
        const noOfferToast = Swal.mixin({
            toast: true,
            position: "top-start",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        noOfferToast.fire({
            icon: "error",
            title: "Cannot offer connection request!"
        });
    });
}

const attach_track_to_peer = (md_stream) => {
    md_stream.getTracks().forEach(track => {
        rtcPeerConnection.addTrack(track, md_stream);
    });
    create_rtc_offer();

    // ICE-Candidate event management
    rtcPeerConnection.addEventListener('icecandidate', data => {
        room_io.emit('send_candidate', data.candidate, client_room_id);
    });

    rtcPeerConnection.addEventListener('addstream', data => {
        distant_video_display.srcObject = data.stream;

        distant_video_display.addEventListener('loadedmetadata', () => {
            distant_video_display.play();
        });
    });

}

const stop_current_media_stream = () => {
    media_stream.getTracks().forEach(track => {
        track.stop();
    });
}

const get_client_screen_stream = () => {
    const screen_constraints = {
        audio: {
            suppressLocalAudioPlayback: false,
        },
        video: {
            displaySurface: "browser",
        },
        preferCurrentTab: false,
        selfBrowserSurface: "exclude",
        systemAudio: "include",
        surfaceSwitching: "include",
        monitorTypeSurfaces: "include",
    }
    window.navigator.mediaDevices.getDisplayMedia(screen_constraints).then(stream => {
        media_stream = stream;
        client_video_display.srcObject = media_stream;

        attach_track_to_peer(media_stream);

        client_video_display.addEventListener('loadedmetadata', () => {
            client_video_display.play().then(() => {
                client_screen_sharing = true;
            }).catch(() => {
                const noScrStartToast = Swal.mixin({
                    toast: true,
                    position: "top-start",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                noScrStartToast.fire({
                    icon: "error",
                    title: "Cannot start screen share!"
                });
            });
        });
    });
}

camera_select_dropdown.addEventListener('input', e => {
    let selected_mode = e.target.value;
    let selected_constraints = {
        audio: true,
        video: {
            facingMode: selected_mode
        }
    }
    stop_current_media_stream();
    get_client_video_stream(selected_constraints);
});

share_screen_btn.addEventListener('click', () => {
    if (client_screen_sharing) {
        stop_current_media_stream();
    } else {
        get_client_screen_stream();
    }
});;

let default_constraints = {
    audio: true,
    video: {
        facingMode: 'user'
    }
};

get_client_video_stream(default_constraints);

// socket io event emission
room_io.emit('client_joined', client_room_id);

room_io.on('new_client_joined', () => {

});

// receiving client's offer from server
room_io.on('client_receive_rtc_offer', offer => {
    // setting session to remote description of client
    rtcPeerConnection.setRemoteDescription(offer);
    // creating answer upon offer
    rtcPeerConnection.createAnswer().then(answer => {
        rtcPeerConnection.setLocalDescription(answer);
        // sending the answer
        room_io.emit('client_send_rtc_answer', answer, client_room_id);
    });
});

// receiving client's answer from server
room_io.on('client_receive_rtc_answer', answer => {
    // setting session to remote description of client
    rtcPeerConnection.setRemoteDescription(answer);
});

// receiving ice-candidate from server
room_io.on('client_receive_candidate', candidate => {
    rtcPeerConnection.addIceCandidate(candidate);
});

// stoping media stream & disclosing peer connection upon refresh
window.addEventListener('beforeunload', e => {
    stop_current_media_stream();
});



