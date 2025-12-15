import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setStatus('success');
    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900">İletişime Geç</h2>
        <p className="mt-4 text-lg text-gray-500">
          Projeleriniz veya sorularınız için aşağıdaki formu kullanabilirsiniz.
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative text-center">
            Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.
          </div>
        ) : (
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Adresiniz</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Konu</label>
              <div className="mt-1">
                <input id="subject" name="subject" type="text" required className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mesajınız</label>
              <div className="mt-1">
                <textarea id="message" name="message" rows={4} required className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Gönder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;