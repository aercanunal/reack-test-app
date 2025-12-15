import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 h-48 sm:h-64"></div>
        <div className="px-8 pb-10">
          <div className="relative flex justify-center sm:justify-start -mt-16 sm:-mt-24 mb-8">
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img src="https://ui-avatars.com/api/?name=Ahmet+Ercan+Unal&background=0D8ABC&color=fff&size=200" alt="Ahmet Ercan Unal" className="w-full h-full object-cover"/>
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Ahmet Ercan Ünal</h1>
            <p className="text-lg text-blue-600 font-medium">Senior Software Engineer</p>
            
            <div className="mt-6 prose text-gray-600 max-w-none">
              <p>
                Merhaba! Ben Ahmet Ercan Ünal. Yazılım geliştirme süreçlerinde modern teknolojiler, temiz kod mimarisi ve ölçeklenebilir sistemler üzerine uzmanlaşmış bir mühendisim.
              </p>
              <p>
                Kariyerim boyunca Java, Spring Boot, React ve Cloud teknolojileri (AWS/Docker) kullanarak kurumsal çözümler ürettim. Problemlere analitik yaklaşmayı ve sürekli öğrenmeyi seven bir yapıya sahibim.
              </p>
              <h3>Uzmanlık Alanları</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none p-0">
                <li className="flex items-center">✅ Full Stack Development</li>
                <li className="flex items-center">✅ Microservices Architecture</li>
                <li className="flex items-center">✅ Cloud Native Apps</li>
                <li className="flex items-center">✅ CI/CD & DevOps</li>
              </ul>
            </div>

            <div className="mt-8 flex justify-center sm:justify-start space-x-6">
              <a href="https://www.linkedin.com/in/ahmet-ercan-unal" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors">
                <Linkedin size={32} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">
                <Github size={32} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="mailto:contact@ahmetercanunal.com" className="text-gray-500 hover:text-red-600 transition-colors">
                <Mail size={32} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;