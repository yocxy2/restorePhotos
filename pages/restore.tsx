import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import { UrlBuilder } from '@bytescale/sdk';
import {
  UploadWidgetConfig,
  UploadWidgetOnPreUploadResult,
} from '@bytescale/upload-widget';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { CompareSlider } from '../components/CompareSlider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import Toggle from '../components/Toggle';
import appendNewToName from '../utils/appendNewToName';
import downloadPhoto from '../utils/downloadPhoto';
import NSFWFilter from 'nsfw-filter';
import { useSession, signIn } from 'next-auth/react';
import useSWR from 'swr';
import { Rings } from 'react-loader-spinner';

const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null); // New state for processed image
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [grayscaleLevel, setGrayscaleLevel] = useState<number>(100); // New state for grayscale level

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR('/api/remaining', fetcher);
  const { data: session, status } = useSession();

  const options: UploadWidgetConfig = {
    apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_KEY || 'free',
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    editor: { images: { crop: false } },
    styles: { colors: { primary: '#000' } },
    onPreUpload: async (
      file: File
    ): Promise<UploadWidgetOnPreUploadResult | undefined> => {
      let isSafe = false;
      try {
        isSafe = await NSFWFilter.isSafe(file);
        console.log({ isSafe });
      } catch (error) {
        console.error('NSFW predictor threw an error', error);
      }
      if (!isSafe) {
        return { errorMessage: 'Detected a NSFW image which is not allowed.' };
      }
      if (data.remainingGenerations === 0) {
        return { errorMessage: 'No more generations left for the day.' };
      }
      return undefined;
    },
  };

  const UploadDropZone = () => (
    <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: 'preset',
              transformationPreset: 'thumbnail',
            },
          });
          setPhotoName(imageName);
          setOriginalPhoto(imageUrl);
          generatePhoto(imageUrl);
        }
      }}
      width='670px'
      height='250px'
    />
  );

  // Function to remove background using an API
  const removeBackground = async (file: File) => {
    const formData = new FormData();
    formData.append('image_file', file);

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': 'YOUR_API_KEY', // Replace with your API key
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });

      setProcessedImage(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };

  const applyGrayscaleWithLevel = (imageSrc: string, level: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;

      if (data) {
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg * (level / 100);
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedImage(canvas.toDataURL());
      }
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalPhoto(URL.createObjectURL(file));
      removeBackground(file);
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      const downloadLink = document.createElement('a');
      downloadLink.href = processedImage;
      downloadLink.download = 'processed-image.png';
      downloadLink.click();
    }
  };

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      mutate();
      setRestoredImage(newPhoto);
    }
    setLoading(false);
  }

  return (
    <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>Restore Photos</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header photo={session?.user?.image || undefined} />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8'>
        {/* Existing UI Components */}
        
        {/* Upload and Grayscale Controls */}
        {status === 'authenticated' && data && (
          <div>
            <p className='text-slate-500'>
              You have{' '}
              <span className='font-semibold'>
                {data.remainingGenerations} generations
              </span>{' '}
              left today. Your generation
              {Number(data.remainingGenerations) > 1 ? 's' : ''} will renew in{' '}
              <span className='font-semibold'>
                {data.hours} hours and {data.minutes} minutes.
              </span>
            </p>
            <input type="file" onChange={handleImageUpload} />
            {processedImage && (
              <div>
                <img src={processedImage} alt="Processed" className='rounded-2xl' />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscaleLevel}
                  onChange={(e) => setGrayscaleLevel(Number(e.target.value))}
                />
                <button onClick={() => applyGrayscaleWithLevel(processedImage, grayscaleLevel)}>
                  Apply Grayscale
                </button>
                <button onClick={downloadImage}>Download Image</button>
              </div>
            )}
          </div>
        )}

        {/* Other existing components and logic */}

        <Footer />
      </main>
    </div>
  );
};

export default Home;
