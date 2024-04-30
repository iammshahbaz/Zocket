import React, { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

// CanvasManager class to encapsulate canvas operations
class CanvasManager {
    constructor(canvasRef, data, imageSrc) {
        this.canvasRef = canvasRef;
        this.data = data;
        this.imageSrc = imageSrc;
        this.context = this.canvasRef.current.getContext('2d');
    }

    drawCanvas(backgroundColor, caption, ctaText) {
        const { context, data, imageSrc } = this;
        const { caption: captionData, cta: ctaData, image_mask: imageMask, urls } = data;

        // Clear canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        // Draw background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        // Draw design pattern
        const designPatternImg = new Image();
        designPatternImg.src = urls.design_pattern;
        designPatternImg.onload = () => {
            context.drawImage(designPatternImg, 0, 0);
        };

        // Draw mask
        const maskImg = new Image();
        maskImg.src = urls.mask;
        maskImg.onload = () => {
            context.drawImage(maskImg, imageMask.x, imageMask.y, imageMask.width, imageMask.height);
        };

        // Draw mask stroke
        const maskStrokeImg = new Image();
        maskStrokeImg.src = urls.stroke;
        maskStrokeImg.onload = () => {
            context.drawImage(maskStrokeImg, imageMask.x, imageMask.y);
        };

        // Draw image
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            context.drawImage(image, imageMask.x + 60, imageMask.y + 60, imageMask.width - 120, imageMask.height - 100);
        };

        // Draw caption
        context.fillStyle = captionData.text_color;
        context.font = `${captionData.font_size}px Arial`;
        context.textAlign = captionData.alignment;
        context.textBaseline = 'top';
        this.wrapText(context, caption, captionData.position.x, captionData.position.y, captionData.max_characters_per_line);

        // Draw CTA
        const ctaWidth = 180;
        const ctaHeight = 60;
        context.fillRect(ctaData.position.x, ctaData.position.y, ctaWidth, ctaHeight);
        context.fillStyle = ctaData.background_color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = `${ctaData.font_size || 30}px Arial`;
        context.fillText(ctaText, ctaData.position.x + ctaWidth / 2, ctaData.position.y + ctaHeight / 2);
    }

    wrapText(context, text, x, y, maxCharactersPerLine) {
        let words = text.split(' ');
        let line = '';
        let lineHeight = this.data.caption.font_size;
        let lines = 1;
        const maxWidth = maxCharactersPerLine * (this.data.caption.font_size * 0.6);

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y + (lines - 1) * lineHeight);
                line = words[n] + ' ';
                lines++;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y + (lines - 1) * lineHeight);
    }
}

const Front = () => {
    const data = {
        "caption": {
            "text": "1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs",
            "position": { "x": 50, "y": 50 },
            "max_characters_per_line": 31,
            "font_size": 44,
            "alignment": "left",
            "text_color": "#FFFFFF"
        },
        "cta": {
            "text": "Shop Now",
            "position": { "x": 190, "y": 320 },
            "text_color": "#FFFFFF",
            "background_color": "#000000"
        },
        "image_mask": {
            "x": 56,
            "y": 442,
            "width": 970,
            "height": 600
        },
        "urls": {
            "mask": "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png?random=12345",
            "stroke": "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png?random=12345",
            "design_pattern": "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png?random=12345"
        }
    };

    const Coffeeimage = "https://img.freepik.com/free-photo/cup-coffee-with-heart-drawn-foam_1286-70.jpg?t=st=1714218266~exp=1714221866~hmac=c054219a6e358ca00d3e9b5620693fae0a71766891cbc324a3854b14d73a5b2c&w=740";

    const [caption, setCaption] = useState(data.caption.text);
    const [ctaText, setCtaText] = useState(data.cta.text);
    const [recentColors, setRecentColors] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('#0369A1');
    const [showPicker, setShowPicker] = useState(false);
    const imageRef = useRef('null');
    const [imageSrc, setImageSrc] = useState(Coffeeimage);
    const canvasRef = useRef(null);
    const canvasManagerRef = useRef(null);

    useEffect(() => {
        const canvasManager = new CanvasManager(canvasRef, data, imageSrc);
        canvasManagerRef.current = canvasManager;
        canvasManager.drawCanvas(backgroundColor, caption, ctaText);
    }, [caption, ctaText, backgroundColor, imageSrc]);

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const handleCtaTextChange = (e) => {
        setCtaText(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleColorButtonClick = (color) => {
        setBackgroundColor(color);
    };

    const handlePickerButtonClick = () => {
        setShowPicker(!showPicker);
    };

    const handleBackgroundColorChange = (color) => {
        const newColor = color.hex;
        setBackgroundColor(newColor);
        if (!recentColors.includes(newColor)) {
            setRecentColors([newColor, ...recentColors.slice(0, 4)]);
        }
    };

    // Style for grid
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
    };

    return (
        <>
            <div class="flex justify-evenly mt-10">
                <canvas ref={canvasRef} height={1080} width={1080} style={{ width: '400px', height: '400px' }} />

                <div style={{ padding: "20px" }}>
                    <h3 className="text-2xl font-bold underline text-center text-green-700" style={{ fontFamily: 'cursive' }}>Ad customization</h3>
                    <p className='text-xl italic font-sans text-gray-500 text-center mt-4'>Customise your ad and get the templates accordingly</p>

                    {/* image */}
                    <div class="flex justify-center align-center">
                        <p className="text-md font-sans text-gray-500 border rounded-md p-2 border-gray-400 mt-5" style={{ fontFamily: 'cursive', boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)', borderColor: '#007bff' }}>
                            Change the ad creative image </p>
                        <input style={{ color: 'blue', marginTop: '25px', marginLeft: '10px' }} type="file" accept="image/*" ref={imageRef} onChange={handleImageChange} />
                    </div>

                    <p className="text-sm font-sans text-gray-500 text-center mt-5" style={gridStyle}>
                        <hr className='mt-2 text-blue-500' style={{ border: "1px solid" }} /><p style={{ color: '#d83261', fontSize: '15px', fontWeight: 'bold', fontFamily: 'cursive' }}>Edit contents</p> <hr className='mt-2 text-purple-700' style={{ border: "1px solid" }} />
                    </p>

                    {/* caption */}
                    <div className="mb-4">
                        <label className="block text-green-700 text-lg font-bold mt-2 mb-2 " htmlFor="username" style={{ fontFamily: 'cursive' }}>
                            Ad Content
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="content"
                            type="text"
                            value={caption}
                            onChange={handleCaptionChange}
                            style={{ fontFamily: 'cursive', boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)', borderColor: '#007bff' }}
                        />
                    </div>

                    {/* CTA */}
                    <div className="mb-6">
                        <label className="block text-green-700 text-lg font-bold mb-2" htmlFor="ctaInput" style={{ fontFamily: 'cursive' }}>
                            CTA
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="ctaInput"
                            type="text"
                            value={ctaText}
                            onChange={handleCtaTextChange}
                            style={{ fontFamily: 'cursive', boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)', borderColor: '#007bff' }}
                        />

                        {/* background_color */}
                        <div>
                            <label className="block text-green-700 text-lg font-bold mt-4" htmlFor="backgroundColorInput" style={{ fontFamily: 'cursive' }}>
                                Choose your color
                            </label>
                            <div className="flex space-x-2 mt-4">
                                {recentColors.map((color, index) => (
                                    <button
                                        key={index}
                                        className="w-4 h-4 rounded-full cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorButtonClick(color)}
                                    />
                                ))}
                                <button
                                    style={{ width: "25px", height: "25px", border: "2px solid", borderRadius: "50%", fontSize: "12px", cursor: "pointer", boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)', borderColor: '#007bff', fontFamily: 'cursive' }}
                                    onClick={handlePickerButtonClick}
                                >+</button>
                            </div>
                            {showPicker && (
                                <ChromePicker
                                    color={backgroundColor}
                                    onChangeComplete={handleBackgroundColorChange}
                                />
                            )}
                        </div>

                    </div>

                </div>
            </div>

        </>

    );
};

export default Front;

