
const distant_video_display = document.getElementById('distant_video_display');
const client_video_display = document.getElementById('client_video_display');
const mic_toggle_btn = document.getElementById("mic_toggle_btn");
const video_toggle_btn = document.getElementById("video_toggle_btn");
const camera_select_dropdown = document.getElementById("camera_select_dropdown");
const mic_select_dropdown = document.getElementById("mic_select_dropdown");

const constraints = {
    audio: true,
    video: {
        facingMode: 'user'
    }
}

let media_stream;

const display_client_video = () => {
    client_video_display.srcObject = media_stream;
    client_video_display.addEventListener('loadedmetadata', () => {
        client_video_display.play();
    });
}


const get_client_video_stream = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
            video: {
                facingMode: 'user' // Use 'environment' for rear camera
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                console.log('Stream obtained:', stream);

                // Attach the video stream to the video element
                client_video_display.srcObject = stream;

                // Add an event listener to handle when the video element starts playing
                client_video_display.addEventListener('loadedmetadata', () => {
                    console.log('Video metadata loaded');
                    client_video_display.play().then(() => {
                        alert('Video playback started');
                    }).catch((error) => {
                        alert('Error starting video playback:', error);
                    });
                });
            })
            .catch((error) => {
                alert('Error accessing media devices:', error);
            });
    } else {
        alert('getUserMedia not supported on your browser!');
    }
    // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    //     media_stream = stream;
    //     display_client_video();
    // }).catch(err => {
    //     const noMediaToast = Swal.mixin({
    //         toast: true,
    //         position: "top-start",
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true
    //     });
    //     noMediaToast.fire({
    //         icon: "error",
    //         title: "Cannot access media devices"
    //     });
    //     console.log(err);
    // });
}
get_client_video_stream();