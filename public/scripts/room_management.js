
const distant_video_display = document.getElementById('distant_video_display');
const client_video_display = document.getElementById('client_video_display');
const mic_toggle_btn = document.getElementById("mic_toggle_btn");
const camera_toggle_btn = document.getElementById("camera_toggle_btn");
const camera_select_dropdown = document.getElementById("camera_select_dropdown");

let media_stream;

let constraints = {
    audio: true,
    video: {
        facingMode: 'user'
    }
};

let client_media_status = {
    is_muted: false,
    is_camera_off: false
}


mic_toggle_btn.addEventListener('click', () => {
    if (client_media_status.is_muted) {
        mic_toggle_btn.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
        client_media_status.is_muted = false;
        media_stream.getAudioTracks().forEach(track => {
            track.enabled = true;
        });
    }else {
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
    }else {
        camera_toggle_btn.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
        client_media_status.is_camera_off = true;
        media_stream.getVideoTracks().forEach(track => {
            track.enabled = false;
        });
    }
});

const get_client_video_stream = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                media_stream = stream;
                client_video_display.srcObject = media_stream;

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

camera_select_dropdown.addEventListener('input', e => {
    let selected_mode = e.target.value;
    constraints.video.facingMode = selected_mode;
    get_client_video_stream();
});

get_client_video_stream();
get_client_cameras();