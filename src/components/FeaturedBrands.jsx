import React from 'react';
import { useNavigate } from 'react-router-dom';
import suzukiLogo from '../assets/logos/suzuki.svg';
import hyundaiLogo from '../assets/logos/hyundai.svg';
import tataLogo from '../assets/logos/tata.svg';
import mahindraLogo from '../assets/logos/mahindra.svg';
import toyotaLogo from '../assets/logos/toyota.svg';
import hondaLogo from '../assets/logos/honda.svg';
import kiaLogo from '../assets/logos/kia.svg';
import renaultLogo from '../assets/logos/renault.svg';

const brands = [
    { name: 'Maruti Suzuki', logo: suzukiLogo },
    { name: 'Hyundai',       logo: hyundaiLogo },
    { name: 'Tata',          logo: tataLogo },
    { name: 'Mahindra',      logo: mahindraLogo },
    { name: 'Toyota',        logo: toyotaLogo },
    { name: 'Honda',         logo: hondaLogo },
    { name: 'Kia',           logo: kiaLogo },
    { name: 'Renault',       logo: renaultLogo },
];

const FeaturedBrands = () => {
    const navigate = useNavigate();

    return (
        <section className="section featured-brands-section" style={{ padding: '80px 0' }}>
            <div className="container">
                <div className="section-header-center">
                    <h2>Browse by Brand</h2>
                    <p className="section-subtitle">Explore India's most trusted manufacturers</p>
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
                                width="120"
                                height="40"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedBrands;
