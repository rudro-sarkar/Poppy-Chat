
const distant_video_display = document.getElementById('distant_video_display');
const client_video_display = document.getElementById('client_video_display');
const mic_toggle_btn = document.getElementById("mic_toggle_btn");
const camera_toggle_btn = document.getElementById("camera_toggle_btn");
const camera_select_dropdown = document.getElementById("camera_select_dropdown");
const mic_select_dropdown = document.getElementById("mic_select_dropdown");

let media_stream;

let constraints;

let client_camera_id;


let default_constraints = {
    audio: true,
    video: {
        facingMode: 'user'
    }
}

let main_constraints = {
    audio: true,
    video: {
        deviceId: client_camera_id
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

const get_client_cameras = () => {
    const active_camera = media_stream.getVideoTracks()[0];
    camera_select_dropdown.innerHTML = "";
    window.navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
            if (device.kind == "videoinput") {
                const camera_option = document.createElement('option');
                if(device.label == active_camera) {
                    camera_option.selected = true;
                }else {
                    camera_option.selected = false;
                }
                camera_option.textContent = device.label;
                camera_option.value = device.deviceId;
                camera_select_dropdown.appendChild(camera_option);
            }
        });
    });
}

const get_client_video_stream = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        if (client_camera_id) {
            constraints = main_constraints;
        }else {
            constraints = default_constraints;
        }

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                console.log('Stream obtained:', stream);

                media_stream = stream;
                client_video_display.srcObject = media_stream;

                client_video_display.addEventListener('loadedmetadata', () => {
                    client_video_display.play().then(() => {
                        alert('Video playback started');
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
    let selected_id = e.target.value;
    client_camera_id = selected_id;
});

get_client_video_stream();
get_client_cameras();