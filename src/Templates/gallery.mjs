import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../firebase.js";
import Header from '../components/header.js';

import Footer from '../components/footer.js'
import '../App.css'




function ImageGallery() {
  const [imageURLs, setImageURLs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(20);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  // array of checkboxes


  useEffect(() => {
    const fetchImageURLs = async () => {
      try {
        const storageRef = ref(storage);
        const result = await listAll(storageRef);
        const urls = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return url;
          })
        );
        setImageURLs(urls);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    fetchImageURLs();
  }, []);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = imageURLs.slice(indexOfFirstImage, indexOfLastImage);

  // handle when we changes pages
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // create popup screen when the user selects and image.


  const handleImageClick = (url) => {
    setSelectedImage(url);
    setIsPopUpOpen(true);
  };

  const totalPages = Math.ceil(imageURLs.length / imagesPerPage);

  return (
    <div>
        <div>
          <Header />
        </div>

        <div className="image-header-container">
          <h1 className="imageHeader">Image Gallery</h1>
          
        </div>
        <div className="image_section">
              {currentImages.map((url) => (
                <div className="image-card" onClick={() => handleImageClick(url)}>
                  <img
                    className="inner-image-card"
                    src={url}
                    alt="Gallery"
                  />
                </div>
              ))}
          </div>

          <div className="pagination-buttons">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </button>
              ))}
          </div>

          {isPopUpOpen && (
            <div className="pop-up">
              <div className="pop-up-content">
                <img src={selectedImage} alt="Selected" />
                <button onClick={() => setIsPopUpOpen(false)}>Close</button>
              </div>
            </div>
          )}


          <div className = 'footer-container'>
              <Footer/>

          </div>
    </div>
  );
}


export default ImageGallery;

