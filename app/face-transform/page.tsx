import { Metadata } from 'next'
import FaceTransform from '@/components/FaceTransform'

export const metadata: Metadata = {
  title: 'AI Face Transform Tool - Transform Your Photos with AI',
  description: 'Transform your photos using AI with various styles including Clay, 3D, Emoji, Pixel Art, and more. Fast, free, and easy to use.',
  keywords: 'AI face transform, photo transformation, AI photo editor, face style transfer, AI image processing',
}

export default function FaceTransformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* SEO Content */}
          <div className="prose max-w-none mb-12">
            <h1 className="text-4xl font-bold text-center mb-6">
              AI Face Transform Tool
            </h1>
            <p className="text-lg text-gray-600 text-center mb-8">
              Transform your photos into various artistic styles using advanced AI technology.
              Create unique versions of your images with just a few clicks.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Features</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Multiple artistic styles (Clay, 3D, Emoji, etc.)</li>
                  <li>Custom prompt control</li>
                  <li>Adjustable transformation settings</li>
                  <li>Instant preview</li>
                  <li>High-quality output</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-3">How to Use</h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Upload your photo or provide an image URL</li>
                  <li>Select your desired transformation style</li>
                  <li>Adjust settings if needed</li>
                  <li>Click "Transform Face" and wait for the magic</li>
                  <li>Download your transformed image</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Tool Component */}
          <FaceTransform />

          {/* Additional SEO Content */}
          <div className="prose max-w-none mt-12">
            <h2 className="text-2xl font-semibold mb-4">
              About Our AI Face Transform Tool
            </h2>
            <p className="text-gray-600 mb-4">
              Our AI Face Transform Tool uses state-of-the-art artificial intelligence to transform your photos into various artistic styles. Whether you're looking to create a clay-like portrait, a 3D render, or a fun emoji version of yourself, our tool makes it easy and fun.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Privacy & Security</h3>
            <p className="text-gray-600 mb-4">
              We take your privacy seriously. All image processing is done securely, and we don't store your original or transformed images permanently. Your data is safe with us.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Technical Specifications</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Supported formats: JPEG, PNG, WebP</li>
              <li>Maximum file size: 10MB</li>
              <li>Recommended image resolution: 512x512 or higher</li>
              <li>Processing time: Usually under 30 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}