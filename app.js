import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// REPLACE THESE with the exact same details from admin.js
const supabaseUrl = 'https://rulnlbbuenrmhngwmbux.supabase.co';
const supabaseKey = 'sb_publishable_dYnmqmmTBSbHG9YV48BOGw_gzEeTg3f';
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

