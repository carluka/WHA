import React from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
 
const PageNotFound = () => {
    return (
        <div style={{
            textAlign: 'center', // Center align text
            paddingTop: '10px', // Add space at the top
        }}>
            <h1 style={{
                fontSize: '6em', // Make the 404 text larger
                marginBottom: '-1em', // Space between "404" and the image
            }}>404</h1>
            <img
                src="https://i.imgur.com/qIufhof.png"
                alt="Page Not Found"
                style={{
                    maxWidth: '100%', // Ensure image is responsive
                    height: 'auto', // Keep image aspect ratio
                }}
            />
            <div style={{
                marginTop: '-40px', // Space between image and text/button
            }}>
                <Link to="/"><Button
                    variant="contained"
                    style={{
                        backgroundColor: '#000', // Black background for the button
                        color: '#fff', // White text for the button
                        marginTop: '10px', // Space above the button
                    }}
                >
                    Back To Homepage
                </Button></Link>
            </div>
        </div >
    )
}
 
export default PageNotFound;