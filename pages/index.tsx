import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SquigglyLines from '../components/SquigglyLines';
import { Testimonials } from '../components/Testimonials';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { UploadIcon, ImageIcon, WandIcon } from 'lucide-react'

const FaceRestorationDemo: React.FC = () => {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [finalImage, setFinalImage] = useState<string | null>(null)
  const [levels, setLevels] = useState([128])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const processImage = () => {
    // Simulate background removal and GFPGAN processing
    setTimeout(() => {
      setProcessedImage('/placeholder.svg?height=300&width=300')
      applyGrayscaleAndLevels()
    }, 1500)
  }

  const applyGrayscaleAndLevels = () => {
    // In a real scenario, this would apply grayscale and levels adjustment
    // Here we're just simulating the process with a placeholder
    setFinalImage('/placeholder.svg?height=300&width=300')
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Face Restoration Demo</CardTitle>
        <CardDescription>Upload an image to see the face restoration process in action</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          <Card className="w-1/3">
            <CardHeader>
              <CardTitle className="text-sm">Original</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {image ? (
                <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
              ) : (
                <ImageIcon className="w-16 h-16 text-muted-foreground" />
              )}
            </CardContent>
          </Card>
          <Card className="w-1/3">
            <CardHeader>
              <CardTitle className="text-sm">Processed</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {processedImage ? (
                <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain" />
              ) : (
                <WandIcon className="w-16 h-16 text-muted-foreground" />
              )}
            </CardContent>
          </Card>
          <Card className="w-1/3">
            <CardHeader>
              <CardTitle className="text-sm">Final</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {finalImage ? (
                <img src={finalImage} alt="Final" className="max-w-full max-h-full object-contain" />
              ) : (
                <ImageIcon className="w-16 h-16 text-muted-foreground" />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-2">
          <Button onClick={() => document.getElementById('fileInput')?.click()} className="w-full">
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button onClick={processImage} className="w-full" disabled={!image}>
            <WandIcon className="w-4 h-4 mr-2" />
            Process Image
          </Button>
        </div>
        <div className="space-y-2">
          <label htmlFor="levels" className="text-sm font-medium">
            Grayscale Levels: {levels[0]}
          </label>
          <Slider
            id="levels"
            min={0}
            max={255}
            step={1}
            value={levels}
            onValueChange={setLevels}
            className="w-full"
          />
        </div>
        <div className="prose prose-sm max-w-none">
          <h3>How it works:</h3>
          <ol>
            <li>Upload your image using the "Upload Image" button.</li>
            <li>Click "Process Image" to start the face restoration process.</li>
            <li>Background removal is simulated (would require additional service integration).</li>
            <li>GFPGAN model processes the image to restore facial features.</li>
            <li>Grayscale conversion is applied with adjustable levels.</li>
            <li>The final restored image is displayed.</li>
          </ol>
          <p>
            This demo uses placeholder images. In a real implementation, you would integrate with
            Replicate's API to use the GFPGAN model, implement background removal, and apply
            grayscale conversion with levels adjustment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const Home: NextPage = () => {
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
        <FaceRestorationDemo />
      </main>
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
