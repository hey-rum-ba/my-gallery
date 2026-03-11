import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// REPLACE THESE with your Supabase project details
const supabaseUrl = 'https://rulnlbbuenrmhngwmbux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bG5sYmJ1ZW5ybWhuZ3dtYnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTQ3OTUsImV4cCI6MjA4ODc5MDc5NX0.BmZExsmRA7cPPZpm-GKH-OluE1dmLSZS3OITMioPir0';
const supabase = createClient(supabaseUrl, supabaseKey);

const imageInput = document.getElementById('imageInput');
const statusMessage = document.getElementById('statusMessage');

window.uploadPicture = async function() {
    const file = imageInput.files[0];
    
    if (!file) {
        statusMessage.innerText = "Please select a picture first.";
        return;
    }

    statusMessage.innerText = "Uploading... please wait.";

    try {
        // 1. Give the file a unique name so they do not overwrite each other
        const fileName = Date.now() + '-' + file.name;
        
        // 2. Upload the file to your 'gallery_images' bucket
        const { error: uploadError } = await supabase.storage
            .from('gallery_images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 3. Get the public internet address for the uploaded image
        const { data: publicUrlData } = supabase.storage
            .from('gallery_images')
            .getPublicUrl(fileName);

        // 4. Save that address into your 'images' database table
        const { error: dbError } = await supabase
            .from('images')
            .insert([{ url: publicUrlData.publicUrl }]);

        if (dbError) throw dbError;

        statusMessage.innerText = "Upload successful!";
        imageInput.value = ""; 

    } catch (error) {
        console.error("Error uploading: ", error);
        statusMessage.innerText = "Upload failed. Check the console for details.";
    }

};
