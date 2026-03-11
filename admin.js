import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// REPLACE THESE with your Supabase project details
const supabaseUrl = 'https://rulnlbbuenrmhngwmbux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bG5sYmJ1ZW5ybWhuZ3dtYnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTQ3OTUsImV4cCI6MjA4ODc5MDc5NX0.BmZExsmRA7cPPZpm-GKH-OluE1dmLSZS3OITMioPir0';
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Grab the elements from our HTML
const imageInput = document.getElementById('imageInput');
const statusMessage = document.getElementById('statusMessage');
const uploadButton = document.getElementById('uploadButton');

// 3. The main upload function
async function uploadPicture() {
    const file = imageInput.files[0];
    
    if (!file) {
        statusMessage.innerText = "Please select a picture first.";
        return;
    }

    statusMessage.innerText = "Uploading... please wait.";

    try {
        // Give the file a unique name using the current timestamp
        const fileName = Date.now() + '-' + file.name;
        
        // Upload the file to your 'gallery_images' bucket in Storage
        const { error: uploadError } = await supabase.storage
            .from('gallery_images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get the public internet address for the new image
        const { data: publicUrlData } = supabase.storage
            .from('gallery_images')
            .getPublicUrl(fileName);

        // Save that public link into your 'images' database table
        const { error: dbError } = await supabase
            .from('images')
            .insert([{ url: publicUrlData.publicUrl }]);

        if (dbError) throw dbError;

        // Update the screen on success
        statusMessage.innerText = "Upload successful!";
        imageInput.value = ""; 

    } catch (error) {
        console.error("Error uploading: ", error);
        statusMessage.innerText = "Upload failed. Check the console for details.";
    }
}

// 4. Attach the function to the button click
uploadButton.addEventListener('click', uploadPicture);


