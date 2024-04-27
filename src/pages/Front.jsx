import React, { useEffect, useRef, useState } from 'react'
import { ChromePicker } from 'react-color';

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

    const wrapText = (context, text, x, y, maxCharactersPerLine) => {
        let words = text.split(' ');
        let line = '';
        let lineHeight = data.caption.font_size;
        let lines = 1;
        const maxWidth = maxCharactersPerLine * (data.caption.font_size * 0.6);

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
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //design

        const designPatternImg = new Image();
        designPatternImg.src = data.urls.design_pattern;
        designPatternImg.onload = () => {
            ctx.drawImage(designPatternImg, 0, 0);
        };

        //mask
        const maskImg = new Image();
        maskImg.src = data.urls.mask;
        maskImg.onload = () => {
            ctx.drawImage(maskImg, data.image_mask.x, data.image_mask.y, data.image_mask.width, data.image_mask.height);
        }

        //mask stroke
        const maskStrokeImg = new Image();
        maskStrokeImg.src = data.urls.stroke;
        maskStrokeImg.onload = () => {
            ctx.drawImage(maskStrokeImg, data.image_mask.x, data.image_mask.y)
        }

        //image

        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            ctx.drawImage(image, data.image_mask.x + 60, data.image_mask.y + 60, data.image_mask.width - 120, data.image_mask.height - 100);
        }

        //Caption
        ctx.fillStyle = data.caption.text_color;
        ctx.font = `${data.caption.font_size}px Arial`;
        ctx.textAlign = data.caption.alignment;
        ctx.textBaseline = 'top';
        wrapText(ctx, caption, data.caption.position.x, data.caption.position.y, data.caption.max_characters_per_line);

        //cta
        const ctaWidth = 180;
        const ctaHeight = 60;
        ctx.fillRect(data.cta.position.x, data.cta.position.y, ctaWidth, ctaHeight)
        ctx.fillStyle = data.cta.background_color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${data.cta.font_size || 30}px Arial`;
        ctx.fillText(ctaText, data.cta.position.x + ctaWidth / 2, data.cta.position.y + ctaHeight / 2);

    }, [caption, ctaText, backgroundColor, imageSrc])


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
    }

    const handleColorButtonClick = (color) => {
        setBackgroundColor(color);
    };

    const handlePickerButtonClick = () => {
        setShowPicker(!showPicker);
    };
    const handleBackgroundColorChange = (color) => {
        const newColor = color.hex;
        setBackgroundColor(newColor)
        if (!recentColors.includes(newColor)) {
            setRecentColors([newColor, ...recentColors.slice(0, 4)]);
        }
    }

    //style for grid
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
    };

    return (
        <>
            <div class="flex justify-evenly mt-10" >
                <canvas ref={canvasRef} height={1080} width={1080} style={{ width: '400px', height: '400px' }} />

                <div style={{ padding: "20px" }}>
                    <h3 className="text-xl font-bold font-sans text-center">Ad customization</h3>
                    <p className='text-md font-sans text-gray-500 text-center mt-4'>Customise your ad and get the templates accordingly</p>

                    {/* image */}
                    <div class="flex justify-center align-center" >
                        <p className="text-sm font-sans text-gray-500 border rounded-md p-2 border-gray-400 mt-5">
                            Change the ad creative image </p>
                        <input style={{ color: 'blue', marginTop: '25px', marginLeft: '10px' }} type="file" accept="image/*" ref={imageRef} onChange={handleImageChange} />
                    </div>

                    <p className="text-sm font-sans text-gray-500 text-center mt-5" style={gridStyle}>
                        <hr className='mt-2' style={{ border: "1px solid" }} />Edit contents <hr className='mt-2' style={{ border: "1px solid" }} />
                    </p>

                    {/* caption */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mt-2 mb-2" htmlFor="username">
                            Ad Content
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="content"
                            type="text"
                            value={caption}
                            onChange={handleCaptionChange}
                        />
                    </div>

                    {/* CTA */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ctaInput">
                            CTA
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="ctaInput"
                            type="text"
                            value={ctaText}
                            onChange={handleCtaTextChange}
                        />
                        
                        {/* background_color */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mt-4" htmlFor="backgroundColorInput">
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
                                    style={{ width: "15px", height: "15px", border: "1px solid gray", borderRadius: "50%", fontSize: "8px", cursor: "pointer" }}
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

    )
}

export default Front