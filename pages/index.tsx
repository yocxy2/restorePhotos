import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SquigglyLines from '../components/SquigglyLines';
import { Testimonials } from '../components/Testimonials';

const Home: NextPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [levels, setLevels] = useState(128);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    // Simulate background removal and GFPGAN processing
    setTimeout(() => {
      setProcessedImage('/placeholder.svg?height=300&width=300');
      applyGrayscaleAndLevels();
    }, 1500);
  };

  const applyGrayscaleAndLevels = () => {
    // In a real scenario, this would apply grayscale and levels adjustment
    // Here we're just simulating the process with a placeholder
    setFinalImage('/placeholder.svg?height=300&width=300');
  };

  return (
    <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>Face Photo Restorer</title>
      </Head>
      <Header />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-20'>
        <a
          href='https://twitter.com/nutlope/status/1704894145003741611'
          target='_blank'
          rel='noreferrer'
          className='border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out'
        >
          Used by over <span className='font-semibold'>470,000</span> happy
          users
        </a>
        <h1 className='mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl'>
          Restoring old photos{' '}
          <span className='relative whitespace-nowrap text-[#3290EE]'>
            <SquigglyLines />
            <span className='relative'>using AI</span>
          </span>{' '}
          for everyone.
        </h1>

        <p className='mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7'>
          Have old and blurry face photos? Let our AI restore them so those
          memories can live on. 100% free – restore your photos today.
        </p>
        <div className='flex justify-center space-x-4'>
          <a
            className='bg-white rounded-xl text-black font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-gray-100 border'
            href='https://www.roomgpt.io/'
            target='_blank'
            rel='noreferrer'
          >
            Check out roomGPT
          </a>

          <Link
            className='bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80'
            href='/restore'
          >
            Restore your photos
          </Link>
        </div>
        <div className='flex justify-between items-center w-full flex-col sm:mt-10 mt-6'>
          <div className='flex flex-col space-y-10 mt-4 mb-16'>
            <div className='flex sm:space-x-2 sm:flex-row flex-col'>
              <div>
                <h2 className='mb-1 font-medium text-lg'>Original Photo</h2>
                <Image
                  alt='Original photo of my bro'
                  src='/michael.jpg'
                  className='w-96 h-96 rounded-2xl'
                  width={400}
                  height={400}
                />
              </div>
              <div className='sm:mt-0 mt-8'>
                <h2 className='mb-1 font-medium text-lg'>Restored Photo</h2>
                <Image
                  alt='Restored photo of my bro'
                  width={400}
                  height={400}
                  src='/michael-new.jpg'
                  className='w-96 h-96 rounded-2xl sm:mt-0 mt-2'
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Face Restoration Demo */}
        <div className="w-full max-w-3xl mx-auto mt-8 border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Face Restoration Demo</h2>
          <p className="mb-4">Upload an image to see the face restoration process in action</p>
          <div className="flex justify-center space-x-4 mb-4">
            <div className="w-1/3 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Original</h3>
              <div className="h-[300px] flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-400">No image uploaded</span>
                )}
              </div>
            </div>
            <div className="w-1/3 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Processed</h3>
              <div className="h-[300px] flex items-center justify-center">
                {processedImage ? (
                  <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-400">Not processed yet</span>
                )}
              </div>
            </div>
            <div className="w-1/3 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Final</h3>
              <div className="h-[300px] flex items-center justify-center">
                {finalImage ? (
                  <img src={finalImage} alt="Final" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-400">Not processed yet</span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button 
                onClick={() => document.getElementById('fileInput')?.click()} 
                className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-300"
              >
                Upload Image
              </button>
            </div>
            <button 
              onClick={processImage} 
              className="w-full bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-300"
              disabled={!image}
            >
              Process Image
            </button>
            <div>
              <label htmlFor="levels" className="block text-sm font-medium text-gray-700 mb-1">
                Grayscale Levels: {levels}
              </label>
              <input
                type="range"
                id="levels"
                min={0}
                max={255}
                value={levels}
                onChange={(e) => setLevels(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <h3 className="font-semibold">How it works:</h3>
            <ol className="list-decimal list-inside">
              <li>Upload your image using the "Upload Image" button.</li>
              <li>Click "Process Image" to start the face restoration process.</li>
              <li>Background removal is simulated (would require additional service integration).</li>
              <li>GFPGAN model processes the image to restore facial features.</li>
              <li>Grayscale conversion is applied with adjustable levels.</li>
              <li>The final restored image is displayed.</li>
            </ol>
            <p className="mt-2">
              This demo uses placeholder images. In a real implementation, you would integrate with
              Replicate's API to use the GFPGAN model, implement background removal, and apply
              grayscale conversion with levels adjustment.
            </p>
          </div>
        </div>
      </main>
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
