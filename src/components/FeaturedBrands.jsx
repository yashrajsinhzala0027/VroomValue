import React from 'react';
import { useNavigate } from 'react-router-dom';
import suzukiLogo from '../assets/logos/suzuki.svg';
import mahindraLogo from '../assets/logos/mahindra.svg';
import kiaLogo from '../assets/logos/kia.svg';

const brands = [
    { name: 'Maruti Suzuki', logo: suzukiLogo },
    { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
    { name: 'Tata', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg' },
    { name: 'Mahindra', logo: mahindraLogo },
    { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
    { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
    { name: 'Kia', logo: kiaLogo },
    { name: 'Renault', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Renault_2021_Text.svg' },
];

const FeaturedBrands = () => {
    const navigate = useNavigate();

    return (
        <section className="section">
            <div className="container">
                <div className="features-header">
                    <h2>Browse by Brand</h2>
                    <p>Explore India's most trusted manufacturers</p>
                </div>

                <div className="brand-grid">
                    {brands.map(brand => (
                        <div
                            key={brand.name}
                            onClick={() => navigate(`/listings?make=${brand.name}`)}
                            className="brand-card"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedBrands;
