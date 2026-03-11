import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// REPLACE THESE with the exact same details from admin.js
const supabaseUrl = 'https://rulnlbbuenrmhngwmbux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bG5sYmJ1ZW5ybWhuZ3dtYnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTQ3OTUsImV4cCI6MjA4ODc5MDc5NX0.BmZExsmRA7cPPZpm-GKH-OluE1dmLSZS3OITMioPir0';
const supabase = createClient(supabaseUrl, supabaseKey);

const galleryContainer = document.getElementById('gallery');

async function loadGallery() {
    try {
        // Ask the database for all rows in the 'images' table, sorted by newest
        const { data, error } = await supabase
            .from('images')
            .select('url')
            .order('created_at', { ascending: false });

        if (error) throw error;

        galleryContainer.innerHTML = "";

        // Loop through the data and create image elements
        data.forEach((image) => {
            const imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.classList.add('gallery-image'); 
            galleryContainer.appendChild(imgElement);
        });

    } catch (error) {
        console.error("Error loading gallery: ", error);
        galleryContainer.innerHTML = "<p>Could not load images right now.</p>";
    }
}


loadGallery();


