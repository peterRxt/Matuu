document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const coverPage = document.getElementById('coverPage');
    const enterBookButton = document.getElementById('enterBook');
    const bookContainer = document.querySelector('.book-container');
    const backgroundMusic = document.getElementById('background-music');

    // Masea Story elements
    const maseaStoryDisplay = document.getElementById('maseaStoryDisplay');
    const maseaStoryEdit = document.getElementById('maseaStoryEdit');
    const maseaStoryTextarea = document.getElementById('maseaStoryTextarea');
    const editMaseaStoryButton = document.getElementById('editMaseaStory');
    const saveMaseaStoryButton = document.getElementById('saveMaseaStory');
    const cancelMaseaStoryButton = document.getElementById('cancelMaseaStory');

    // PDF Download elements
    const downloadPdfButton = document.getElementById('downloadPdfButton');
    const adminUsername = 'admin';
    const adminPassword = '1234';

    // Exit Book button
    const exitBookButton = document.getElementById('exitBookButton');

    // --- Cover Page and Music Logic ---
    enterBookButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        bookContainer.style.display = 'block';
        playBackgroundMusic();
        showSection('peterStory');
    });

    exitBookButton.addEventListener('click', () => {
        bookContainer.style.display = 'none';
        coverPage.style.display = 'flex';
        pauseBackgroundMusic();
    });

    function playBackgroundMusic() {
        backgroundMusic.volume = 0.3;
        backgroundMusic.play().catch(error => {
            console.warn("Autoplay was prevented:", error);
        });
    }

    function pauseBackgroundMusic() {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    // --- Navigation Logic ---
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.style.opacity = '0';
        });
        
        const activeSection = document.getElementById(sectionId);
        activeSection.classList.add('active');
        setTimeout(() => {
            activeSection.style.opacity = '1';
        }, 10);

        navButtons.forEach(button => {
            if (button.dataset.target === sectionId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    navButtons.forEach(button => {
        if (button.id !== 'exitBookButton' && button.id !== 'downloadPdfButton') {
            button.addEventListener('click', () => {
                showSection(button.dataset.target);
            });
        }
    });

    // --- Masea Story Logic ---
    const maseaStoryKey = 'maseaStoryContent';

    function loadMaseaStory() {
        const savedContent = localStorage.getItem(maseaStoryKey);
        if (savedContent) {
            maseaStoryDisplay.innerHTML = `<p>${savedContent.replace(/\n/g, '<br>')}</p><button id="editMaseaStory">Write/Edit My Story</button>`;
        } else {
            maseaStoryDisplay.innerHTML = `<p>This is where Vincencia's story will be. Vincencia, please share your memories and experiences here. Your story is an important part of our journey. ❤️</p><button id="editMaseaStory">Write/Edit My Story</button>`;
        }
        
        const currentEditButton = document.getElementById('editMaseaStory');
        if (currentEditButton) {
            currentEditButton.addEventListener('click', toggleMaseaStoryEdit);
        }
    }

    function toggleMaseaStoryEdit() {
        maseaStoryDisplay.style.display = 'none';
        maseaStoryEdit.style.display = 'block';
        maseaStoryTextarea.value = localStorage.getItem(maseaStoryKey) || '';
        maseaStoryTextarea.focus();
    }

    saveMaseaStoryButton.addEventListener('click', () => {
        const contentToSave = maseaStoryTextarea.value;
        localStorage.setItem(maseaStoryKey, contentToSave);
        loadMaseaStory();
        maseaStoryEdit.style.display = 'none';
        maseaStoryDisplay.style.display = 'block';
    });

    cancelMaseaStoryButton.addEventListener('click', () => {
        maseaStoryEdit.style.display = 'none';
        maseaStoryDisplay.style.display = 'block';
        maseaStoryTextarea.value = localStorage.getItem(maseaStoryKey) || '';
    });

    // Initial load for Masea's story
    loadMaseaStory();

    // --- PDF Download Logic ---
    downloadPdfButton.addEventListener('click', () => {
        const username = prompt('Enter username:');
        const password = prompt('Enter password:');

        if (username === adminUsername && password === adminPassword) {
            const currentActiveSection = document.querySelector('.content-section.active');
            let contentToPrint;
            let filename = 'Our_Story.pdf';

            let restoreMaseaEditState = false;
            if (maseaStoryEdit.style.display === 'block') {
                maseaStoryEdit.style.display = 'none';
                maseaStoryDisplay.style.display = 'block';
                restoreMaseaEditState = true;
            }

            if (currentActiveSection.id === 'peterStory') {
                contentToPrint = document.getElementById('peterStory').querySelector('.story-content');
                filename = 'Peter_Story.pdf';
            } else if (currentActiveSection.id === 'maseaStory') {
                const maseaContentDiv = document.createElement('div');
                const savedMaseaContent = localStorage.getItem(maseaStoryKey);
                if (savedMaseaContent) {
                    maseaContentDiv.innerHTML = `<h2>Masea's Story</h2><p>${savedMaseaContent.replace(/\n/g, '<br>')}</p>`;
                } else {
                    maseaContentDiv.innerHTML = `<h2>Masea's Story</h2><p>No story saved yet for Masea.</p>`;
                }
                contentToPrint = maseaContentDiv;
                filename = 'Masea_Story.pdf';
            } else {
                contentToPrint = document.createElement('div');
                contentToPrint.innerHTML = `
                    <h1 style="text-align: center; font-family: 'Playfair Display', serif; color: #555;">Our Combined Story</h1>
                    <hr style="margin: 30px auto; border: 0; border-top: 2px solid #FFC0CB; width: 50%;">

                    <div style="margin-bottom: 40px;">
                        <h2 style="text-align: center; font-family: 'Playfair Display', serif; color: #555;">Peter's Story</h2>
                        ${document.getElementById('peterStory').querySelector('.story-content').innerHTML}
                    </div>

                    <hr style="margin: 40px auto; border: 0; border-top: 1px dashed #ccc; width: 70%;">

                    <div style="margin-top: 40px;">
                        <h2 style="text-align: center; font-family: 'Playfair Display', serif; color: #555;">Masea's Story</h2>
                        ${localStorage.getItem(maseaStoryKey) ? `<p>${localStorage.getItem(maseaStoryKey).replace(/\n/g, '<br>')}</p>` : '<p>No story saved yet for Masea.</p>'}
                    </div>
                `;
                filename = 'Our_Combined_Story.pdf';
            }

            html2pdf().from(contentToPrint).save(filename).finally(() => {
                if (restoreMaseaEditState) {
                    maseaStoryEdit.style.display = 'block';
                    maseaStoryDisplay.style.display = 'none';
                }
            });

        } else {
            alert('Incorrect username or password.');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
