import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  position: absolute;
  margin-top: 40px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
  padding: 20px;
  background: linear-gradient(to right, #fd18fe, purple);
  -webkit-background-clip: text;
  color: transparent;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 400px;
  margin-top: 20px;
`;

const LoadingImage = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ffffff;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const QuoteContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Blockquote = styled.blockquote`
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  line-height: 1.6;
`;

const ZenQuotes = () => {
  const [quoteData, setQuoteData] = useState(null);
  const [isImageSaved, setIsImageSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessKeyResponse = await fetch(
          "http://localhost:8080/api/config/unsplash"
        );
        const unsplashAccessKey = await accessKeyResponse.text();

        // Fetch motivational quote data
        const response = await fetch("http://localhost:8080/api/today-proxy");
        const data = await response.json();

        setQuoteData(data);

        // Fetch Unsplash photos with the dynamic access key
        fetchPhotos(data[0].q, unsplashAccessKey);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, ); // Empty dependency array to run the effect only once

  // Update the fetchPhotos function in ZenQuotes.js
  const fetchPhotos = async (query, unsplashAccessKey) => {
    try {
      const photoResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashAccessKey}`,
          },
        }
      );

      const photoData = await photoResponse.json();

      if (photoData.results && photoData.results.length > 0) {
        const imageUrl = photoData.results[0].urls.regular;

        // Fetch the blob data
        const blobResponse = await fetch(imageUrl);
        const blob = await blobResponse.blob();

        // Convert the blob data to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result.split(",")[1];

          // Send the base64 data to the server
          saveImageToServer(base64Data);
        };

        reader.readAsDataURL(blob);
      } else {
        console.error("No image results found.");
      }
    } catch (error) {
      console.error("Error fetching or saving photos:", error);
    }
  };

  const handleImageSaved = async () => {
    setIsImageSaved(true);
    setIsLoading(false);
  };

  const pollImageAvailability = async () => {
    const maxAttempts = 10; // Maximum attempts to check for the image
    let attempts = 0;
    const timeout = 10000;

    const startTime = Date.now();

    while (attempts < maxAttempts) {
      if (Date.now() - startTime >= timeout) {
        // If the timeout period has passed, exit the loop
        break;
      }
      try {
        const response = await fetch(
          `http://localhost:8080/${localImagePath}`,
          {
            method: "HEAD",
          }
        );

        if (response.ok) {
          handleImageSaved();
          return;
        }
      } catch (error) {
        console.error("Error checking image availability:", error);
      }

      // Wait for 1 second before the next attempt
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    // If after all attempts the image is still not available, set isImageSaved to false
    setIsImageSaved(false);
  };

  const saveImageToServer = async (base64Data) => {
    try {
      const response = await fetch("http://localhost:8080/api/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: base64Data,
          fileName: "downloaded-image.jpg",
        }),
      });

      await response.text();

      pollImageAvailability(); // Start polling for image availability
    } catch (error) {
      console.error("Error sending image data to server:", error);
      setIsImageSaved(false);
    }
  };

  // Dynamically generate the path to the local image file based on the current date
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear().toString();

  const filename = `${day}_${month}_${year}.jpg`;

  const localImagePath = `images/${filename}`;

  return (
    <Container>
      {isLoading ? ( // Check the loading state
        <LoadingImage>
          <LoadingSpinner />
        </LoadingImage>
      ) : (
        <div>
          {isImageSaved ? ( // Check the image saved state
            <Image
              src={localImagePath}
              alt={quoteData && quoteData.length > 0 ? quoteData[0].a : ""}
            />
          ) : (
            <LoadingImage>
              <LoadingSpinner />
            </LoadingImage>
          )}
        </div>
      )}

      {quoteData && quoteData.length > 0 && (
        <QuoteContainer>
          <Blockquote>
            <p>{quoteData[0].q}</p>
            <footer>— {quoteData[0].a}</footer>
          </Blockquote>
        </QuoteContainer>
      )}
    </Container>
  );
};

export default ZenQuotes;
