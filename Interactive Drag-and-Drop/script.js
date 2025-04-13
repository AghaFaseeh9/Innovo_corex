document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const imageInput = document.getElementById('imageInput');
    const lightbox = document.getElementById('lightbox');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;
    let images = [];

    // Load saved images from localStorage
    loadSavedImages();

    // Image Upload Handler
    imageInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const imageUrl = e.target.result;
                    addImageToGallery(imageUrl);
                };
                
                reader.readAsDataURL(file);
            }
        });
    });

    // Add image to gallery
    function addImageToGallery(imageUrl) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.draggable = true;
        
        galleryItem.innerHTML = `
            <img src="${imageUrl}" alt="Gallery image">
            <button class="delete-btn">✖</button>
        `;

        // Add drag and drop event listeners
        galleryItem.addEventListener('dragstart', handleDragStart);
        galleryItem.addEventListener('dragend', handleDragEnd);
        galleryItem.addEventListener('dragover', handleDragOver);
        galleryItem.addEventListener('drop', handleDrop);

        // Add 3D tilt effect
        galleryItem.addEventListener('mousemove', handleTilt);
        galleryItem.addEventListener('mouseleave', resetTilt);

        // Add click event for lightbox
        galleryItem.querySelector('img').addEventListener('click', () => {
            openLightbox(galleryItem.querySelector('img').src);
        });

        // Add delete button functionality
        galleryItem.querySelector('.delete-btn').addEventListener('click', () => {
            galleryItem.remove();
            saveGalleryState();
        });

        gallery.appendChild(galleryItem);
        images.push(imageUrl);
        saveGalleryState();
    }

    // 3D Tilt Effect
    function handleTilt(e) {
        const card = this;
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        
        // Calculate mouse position relative to card center
        const mouseX = e.clientX - cardRect.left - cardWidth / 2;
        const mouseY = e.clientY - cardRect.top - cardHeight / 2;
        
        // Calculate rotation (max 10 degrees)
        const rotateY = (mouseX / (cardWidth / 2)) * 10;
        const rotateX = -(mouseY / (cardHeight / 2)) * 10;
        
        // Apply transform
        card.style.transform = `translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function resetTilt() {
        this.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
    }

    // Drag and Drop Handlers
    function handleDragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', Array.from(gallery.children).indexOf(this));
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        resetTilt.call(this);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const dropIndex = Array.from(gallery.children).indexOf(this);
        
        if (draggedIndex !== dropIndex) {
            const items = Array.from(gallery.children);
            const draggedItem = items[draggedIndex];
            const dropItem = items[dropIndex];
            
            if (draggedIndex < dropIndex) {
                dropItem.parentNode.insertBefore(draggedItem, dropItem.nextSibling);
            } else {
                dropItem.parentNode.insertBefore(draggedItem, dropItem);
            }
            
            // Update images array
            const draggedImage = images[draggedIndex];
            images.splice(draggedIndex, 1);
            images.splice(dropIndex, 0, draggedImage);
            
            saveGalleryState();
        }
    }

    // Lightbox Handlers
    function openLightbox(imageSrc) {
        currentImageIndex = images.indexOf(imageSrc);
        modalImage.src = imageSrc;
        lightbox.style.display = 'block';
        updateNavigationButtons();
        
        // Add entrance animation
        modalImage.style.opacity = '0';
        modalImage.style.transform = 'translateZ(100px) scale(0.8)';
        
        setTimeout(() => {
            modalImage.style.opacity = '1';
            modalImage.style.transform = 'translateZ(50px) scale(1)';
        }, 50);
    }

    function closeLightbox() {
        modalImage.style.opacity = '0';
        modalImage.style.transform = 'translateZ(100px) scale(0.8)';
        
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModalImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModalImage();
    }

    function updateModalImage() {
        modalImage.style.opacity = '0';
        modalImage.style.transform = 'translateZ(100px) scale(0.8)';
        
        setTimeout(() => {
            modalImage.src = images[currentImageIndex];
            modalImage.style.opacity = '1';
            modalImage.style.transform = 'translateZ(50px) scale(1)';
        }, 300);
    }

    function updateNavigationButtons() {
        prevBtn.style.display = images.length > 1 ? 'block' : 'none';
        nextBtn.style.display = images.length > 1 ? 'block' : 'none';
    }

    // Event Listeners for Lightbox
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
            }
        }
    });

    // Local Storage Functions
    function saveGalleryState() {
        localStorage.setItem('galleryImages', JSON.stringify(images));
    }

    function loadSavedImages() {
        const savedImages = localStorage.getItem('galleryImages');
        if (savedImages) {
            images = JSON.parse(savedImages);
            images.forEach(imageUrl => {
                addImageToGallery(imageUrl);
            });
        }
    }
}); 