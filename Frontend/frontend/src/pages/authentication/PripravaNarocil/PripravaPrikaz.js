import React, { useState, useEffect, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Checkbox from "@mui/material/Checkbox";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import api from "../../../services/api";
import CameraIcon from "@mui/icons-material/Camera";
import jsQR from "jsqr";

export default function PripravaPrikaz({ narocilo_id }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [scannerData, setScannerData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let intervalId;
  const [artikel, setItemData] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]); // Add state to keep track of selected articles
  const [isChecked, setIsChecked] = useState(false);

  // Define the handleStanjeUpdate function
  const handleStanjeUpdate = () => {
    // Make an API call to update the stanjeNarocila to "DOING"
    api
      .put(`/narocila/posodobi/stanje/${narocilo_id}`, {
        stanjeNarocila: "DONE",
        casPriprave: new Date().toISOString(),
      })
      .then((response) => {
        // Update the state of stanjeNarocila in your component
        // Assuming that the response contains the updated order details
        const updatedOrder = response.data;
        // Update the state with the updated order
        // For example, you can update the 'orderDetails' state with the updated order
        // This will trigger a re-render and show the updated "DOING" state
        setOrderDetails(updatedOrder);

        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating stanjeNarocila!", error);
      });
  };

  useEffect(() => {
    api
      .get(`/narocila/${narocilo_id}`)
      .then((result) => {
        const narocilo = result.data;
        const fetchPromises = narocilo.artikli.map((number) =>
          api.get(`/artikli/${number}`)
        );

        Promise.all(fetchPromises)
          .then((productsData) => {
            const fetchedProducts = productsData.map(
              (productData) => productData.data
            );
            setOrderDetails({
              ...narocilo,
              products: fetchedProducts,
            });
          })
          .catch((error) => {
            console.error("Error fetching products for the order!", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching order details!", error);
      });
  }, [narocilo_id]);

  useEffect(() => {
    if (!isCameraActive) {
      stopCamera();
      return;
    }

    startCamera();

    return () => stopCamera();
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }

    intervalId = setInterval(() => {
      captureImage();
    }, 1000);
  };

  const stopCamera = () => {
    if (intervalId) clearInterval(intervalId);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (
      videoRef.current &&
      canvasRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
    ) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      if (width && height) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        const context = canvasRef.current.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, width, height);

        const imageData = context.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, width, height);

        if (code) {
          setScannerData(code.data);
          const match = code.data.match(/ID_artikel=(\d+)/);
          if (match && match[1]) {
            fetchItemData(match[1]);
          }
          setIsCameraActive(false); // Automatically close and stop the camera
        }
      }
    }
  };

  const fetchItemData = async (itemId) => {
    try {
      const response = await api.get(`/artikli/${itemId}`);
      const itemData = response.data;

      // Log the type of product.id_artikel
      console.log("Type of product.id_artikel:", typeof itemData.id_artikel);

      // Convert itemId to a number
      const itemIdAsNumber = parseInt(itemId, 10);

      // Check if itemIdAsNumber matches the product.id_artikel
      if (itemIdAsNumber === itemData.id_artikel) {
        console.log("Product ID matches selected ID:", itemIdAsNumber);
      } else {
        console.log("Product ID does not match selected ID:", itemIdAsNumber);
      }

      // Initialize selectedArticles as an empty array if it's undefined
      const updatedSelectedArticles = selectedArticles || [];

      // Add the selected article to the state
      console.log("Adding to selectedArticles:", itemIdAsNumber);
      setSelectedArticles((prevSelected) => [...prevSelected, itemIdAsNumber]);
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  const handleCameraClick = () => {
    if (isCameraActive) {
      setIsCameraActive(false);
    } else {
      setScannerData(null); // Reset scanner data for a new scan
      setIsCameraActive(true);
    }
  };

  console.log("orderDetails:", orderDetails);
  console.log("selectedArticles:", selectedArticles);

  return (
    <div>
      <div
        style={{ textAlign: "left", marginBottom: "20px", marginLeft: "20px" }}
      >
        <Button
          variant="contained"
          startIcon={<CameraIcon />}
          onClick={handleCameraClick}
        >
          {isCameraActive ? "CLOSE" : "SKENIRAJ"}
        </Button>
        {isCameraActive && (
          <div>
            <video
              ref={videoRef}
              width="640"
              height="480"
              autoPlay
              playsInline
            ></video>
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{ display: "none" }}
            ></canvas>
          </div>
        )}
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Datum Vnosa</TableCell>
              <TableCell align="right">Stranka</TableCell>
              <TableCell align="right">Zaposleni</TableCell>
              <TableCell align="right">Rok Priprave</TableCell>
              <TableCell align="right">Skupaj Cena</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails && (
              <React.Fragment>
                <TableRow
                  key={orderDetails.id_artikel}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ color: "grey" }}
                  >
                    {orderDetails.id_narocilo}
                  </TableCell>
                  <TableCell align="right">
                    {orderDetails.datumVnosa
                      ? new Date(orderDetails.datumVnosa).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell align="right">
                    {orderDetails.stranka ? orderDetails.stranka.naziv : ""}
                  </TableCell>
                  <TableCell align="right">
                    {orderDetails.zaposlen
                      ? `${orderDetails.zaposlen.ime} ${orderDetails.zaposlen.priimek}`
                      : ""}
                  </TableCell>
                  <TableCell align="right">
                    {orderDetails.rokPriprave
                      ? new Date(orderDetails.rokPriprave).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell align="right">
                    {orderDetails.cenaSkupaj
                      ? orderDetails.cenaSkupaj + " €"
                      : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8}>
                    <Table size="small" aria-label="product details">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Naziv</TableCell>
                          <TableCell>Dobavna Cena</TableCell>
                          <TableCell>Prodajna Cena</TableCell>
                          <TableCell>Količina</TableCell>
                          <TableCell>Skupaj</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderDetails.products ? (
                          orderDetails.products.map((product, index) => (
                            <TableRow key={product.id_artikel}>
                              <TableCell>{product.id_artikel}</TableCell>
                              <TableCell>{product.naziv}</TableCell>
                              <TableCell>
                                {product.dobavnaCena + " €"}
                              </TableCell>
                              <TableCell>
                                {product.prodajnaCena + " €"}
                              </TableCell>
                              <TableCell>
                                {orderDetails.seznamKolicin[index]}
                              </TableCell>
                              <TableCell>
                                {(
                                  product.prodajnaCena *
                                  orderDetails.seznamKolicin[index]
                                ).toFixed(2) + " €"}
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={selectedArticles.includes(
                                    product.id_artikel
                                  )}
                                  onChange={() => {
                                    setSelectedArticles((prevState) => {
                                      if (
                                        prevState.includes(product.id_artikel)
                                      ) {
                                        return prevState.filter(
                                          (id) => id !== product.id_artikel
                                        );
                                      } else {
                                        return [
                                          ...prevState,
                                          product.id_artikel,
                                        ];
                                      }
                                    });
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7}>
                              No products available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {orderDetails && (
        <div
          style={{ textAlign: "right", marginTop: "20px", marginRight: "20px" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleStanjeUpdate}
          >
            ODDAJ NAROČILO
          </Button>
        </div>
      )}
    </div>
  );
}
