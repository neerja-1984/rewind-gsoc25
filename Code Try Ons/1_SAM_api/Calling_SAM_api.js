console.log("Ouputing SamJs")
console.log(SamJs);

// Create a new instance
const sam = new SamJs();

// Get the buttons
const speakBtn = document.getElementById('speakButton');

// Speak some text
speakBtn.addEventListener( 'click' , () => {
    sam.speak('Hello world ; its me SAM')
    .then(() => 
        console.log('Finished speaking')
    )
    .catch(console.error);
})

// Generate and download a WAV file
sam.download('Lets Make Google Summer Of Code 2025 a success !!');
console.log('Check your downloads folder for the WAV file');
