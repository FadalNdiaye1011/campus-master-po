import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-100 px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                <div>© 2024 CampusMaster. Tous droits réservés.</div>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <a href="#" className="hover:text-blue-600 transition">Confidentialité</a>
                    <a href="#" className="hover:text-blue-600 transition">Conditions</a>
                    <a href="#" className="hover:text-blue-600 transition">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;