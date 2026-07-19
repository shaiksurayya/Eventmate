// modern.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./modern.css";
import {
  FaStar,
  FaPhone,
  FaWhatsapp,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



// === Arrows for Photographer Slider ===
const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      padding: 10,
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2,
      cursor: "pointer",
      background: "rgba(255,255,255,0.8)",
      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
    }}
  >
    <FaArrowRight style={{ color: "#000" }} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      padding: 10,
      position: "absolute",
      left: 10,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2,
      cursor: "pointer",
      background: "rgba(255,255,255,0.8)",
      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
    }}
  >
    <FaArrowLeft style={{ color: "#000" }} />
  </div>
);

// === Photographers Card ===
const ServiceCard = ({ service }) => {
  const isCarousel = Array.isArray(service.images) && service.images.length > 1;

  const sliderSettings = {
    dots: true,
    infinite: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {isCarousel ? (
        <Slider {...sliderSettings}>
          {service.images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`${service.name} ${index + 1}`}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <img
          src={service.image}
          alt={service.name}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
          }}
        />
      )}

      <div style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>
          <Link
            to={`/${service.type || "planner"}/${service.id}`}
            style={{ textDecoration: "none", color: "#111827" }}
          >
            {service.name}
          </Link>
        </h3>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <FaStar style={{ color: "#fbbf24", marginRight: 4 }} />
          <span style={{ fontSize: 14, color: "#555" }}>{service.rating}</span>
          <span style={{ margin: "0 8px", color: "#ccc" }}>•</span>
          <span style={{ fontSize: 14, color: "#555" }}>
            {service.location || "India"}
          </span>
        </div>

        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#059669",
            marginBottom: 12,
          }}
        >
          {service.price}
        </div>

        {/* Contact Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: 10 }}>
          {/* Call */}
          <a
            href={`tel:${service.phone || "+919876543210"}`}
            style={{
              flex: 1,
              background: "#059669",
              color: "#fff",
              borderRadius: 8,
              padding: "10px 0",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 600,
              position: "relative",
            }}
          >
            <FaPhone style={{ marginRight: 6 }} /> Call
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${service.phone?.replace(/\D/g, "") || "919812345678"}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              background: "#25D366",
              color: "#fff",
              borderRadius: 8,
              padding: "10px 0",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 600,
              position: "relative",
            }}
          >
            <FaWhatsapp style={{ marginRight: 6 }} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

// === Cakes Section Data ===
const cakes = [
 
  {
    id: 6,
    name: "Choco Charm",
    rating: 4.5,
    price: "₹ 1,900 - 2,700 per 2 kg",
        flavour:"choclate ,vanilla ,red velvet ,strawberry ,pineapple ,butterscotch , Mango ,Salted Caramel ,Coffe and Oreo.",
    

    location: "Pune",
    images: ["/images/cake6.jpg", "/images/cake2.jpg", "/images/cake3.webp"],
    phone: "+918765432109",
    description: "Choco Charm is a paradise for chocolate lovers. We offer rich chocolate cakes, truffles, and ganache delights. Every creation is made with passion and love for chocolate."
  },
  {
    id: 7,
    name: "Frost & Flavors",
    rating: 4.7,
    price: "₹ 2,300 - 3,700 per 2 kg",
        flavour:"choclate ,vanilla ,red velvet ,strawberry ,pineapple ,butterscotch,Coffee,Almond,Peanut Butter and Oreo.",
    

    location: "Delhi",
    images: ["/images/cake7.jpg", "/images/c2.jpeg", "/images/c3.jpg"],
    phone: "+919123456789",
    description: "Frost & Flavors is famous for its creamy, flavorful cakes and custom designs. We cater to weddings, birthdays, and corporate events with unique, hand-decorated cakes."
  },
  {
    id: 8,
    name: "The Crown Confections",
    rating: 4.6,
    price: "₹ 6,000 - 18,000 per 2 kg",
        flavour:"choclate ,vanilla ,red velvet ,strawberry ,pineapple ,butterscotch, Matcha, Pistachio and Oreo.",
    

    location: "Bangalore",
    images: ["https://media.istockphoto.com/id/1413002733/photo/the-brides-cake-with-white-and-pink-roses-at-the-wedding.jpg?s=2048x2048&w=is&k=20&c=sZWqM1oyDWKKjrrXeVLPPATybr41Ka_VNkGLP3iAJdk=", "https://media.istockphoto.com/id/918008366/photo/wedding-cake.jpg?s=2048x2048&w=is&k=20&c=e9r4EkpfaiyHA0OyJNk-nX79sQDwUjdeODTXrPEuStU=", "https://media.istockphoto.com/id/689792874/photo/white-wedding-cake.jpg?s=2048x2048&w=is&k=20&c=u2oDGK0F8nA-_IhBVuHpaNpu0giEo3fIyztrYkJyQMs=","https://media.istockphoto.com/id/491871487/photo/wedding-cake.jpg?s=2048x2048&w=is&k=20&c=bfyyOZak9KRO4ympp3A2DAH70FvAMjTTD_xJE4Ef9_4="],

    phone: "+919876512345",
    description: "The Crown Confections offers a wide range of cakes, muffins, and pastries. Our cakes are baked fresh daily using premium ingredients, making every bite a delightful experience."
  },

];

// === Custom Arrows for Cake Slider ===
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        right: 10,
        zIndex: 2,
        background: "rgba(0,0,0,0.4)",
        borderRadius: "50%",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: 10,
        zIndex: 2,
        background: "rgba(0,0,0,0.4)",
        borderRadius: "50%",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
};

// === Cake Card ===
const CakeCard = ({ service }) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    const whatsappUrl = `https://wa.me/${service.phone.replace(
      /[^0-9]/g,
      ""
    )}?text=Hi! I'm interested in ordering a cake from ${service.name}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      onClick={() => navigate(`/cakes/${service.id}`)}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Slider {...settings}>
          {service.images.map((img, idx) => (
            <div key={idx}>
              <img
                src={img}
                alt={`${service.name} ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "contain",
                  objectPosition: "center",
                  display: "block",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>
          {service.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <FaStar style={{ color: "#fbbf24", marginRight: 4 }} />
          <span style={{ fontSize: 14, color: "#555" }}>{service.rating}</span>
          <span style={{ margin: "0 8px", color: "#ccc" }}>•</span>
          <span style={{ fontSize: 14, color: "#555" }}>{service.location}</span>
        </div>

        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#059669",
            marginBottom: 12,
          }}
        >
          {service.price}
        </div>

        <button
          onClick={handleOrder}
          style={{
            width: "100%",
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 0",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#22c55e")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#25D366")
          }
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

const planners = [
  
  {
    id: 3,
    name: "Himanshu Sharma",
    rating: 4.8,
    price: "₹20,000",
    // location: "Mumbai",
    image:"https://media.istockphoto.com/id/1412021265/photo/head-shot-portrait-smiling-bearded-man-looking-at-camera.jpg?s=2048x2048&w=is&k=20&c=M4dFUZwVsUEUfLi5ixFjubRgx2ly-QxV5llizOAz3rs=",
    call: "+91 93456 78120",
    whatsapp: "+91 99112 33445",
  },
  {
    id: 4,
    name: "Aakash Pandey",
    rating: 4.6,
    price: "₹25,000",
    //location: "Delhi",
    //image: "images/photo4.jpg",
        image:"https://media.istockphoto.com/id/1459185149/photo/portrait-of-young-man-shaking-head-as-yes-sign-approval.jpg?s=1024x1024&w=is&k=20&c=5bvev5LhMOH7ZCUO3jnPPCVkc0RwnMppRV0ncZZAW4Q=",

    call: "+91 97865 43120",
    whatsapp: "+91 90909 80808",
  },
];

  // ===== Attires Data =====
  const attires = [
    
    {
      id: 7,
      name: "Love and Lace Bridal Studio",
      rating: 4.7,
      price: "₹ 90,000 - 9,00000",
      location: "Bangalore",
      images: ["https://media.istockphoto.com/id/489247232/photo/happy-indian-couple-at-their-wedding.jpg?s=1024x1024&w=is&k=20&c=plKQ5ceiIEg8fI8I3EwxQb3SY-y66MnxUeOgqsVMFNA=","/images/a6.jpg","https://media.istockphoto.com/id/1085741022/photo/portrait-of-the-bride-and-groom-in-nature-beautiful-couple-in-love.jpg?s=2048x2048&w=is&k=20&c=u6yCHOzfytV_2O8RhY-aDGE2p8G2EaZHLADI0Zk9HEU=","https://media.istockphoto.com/id/2200817252/photo/close-up-portrait-of-beautiful-bride-in-traditional-dress-and-jewelry-posing.jpg?s=2048x2048&w=is&k=20&c=QXZCi7pGh0Gx4DhclUwqvbYK-nkbam-8yU2BJPEhi-Q=" ,"/images/a1.jpg"],
      phone: "+91 76543 21101",
    },
    {
      id: 8,
      name: "Wedding Chic",
      rating: 4.6,
      price: "₹ 85,000 -11,00000",
      location: "Lucknow",
      images: ["https://media.istockphoto.com/id/2200639341/photo/loving-couple-holding-hands-and-looking-at-each-other-on-white-background.jpg?s=2048x2048&w=is&k=20&c=SnYektEKvW_SpCdenwQWMd58-9Kw0vcBiGARl81Rh7c=","/images/a7.jpg","https://media.istockphoto.com/id/2180166290/photo/happy-smiling-newlywed-bride-and-groom-walk-outside.jpg?s=2048x2048&w=is&k=20&c=FlFLrWYB1dmrK1pAJsG7iuXEYsMQwAHvKU7QGb8MTak=","https://media.istockphoto.com/id/2200631854/photo/happy-bride-in-traditional-clothing-dancing-over-white-background.jpg?s=2048x2048&w=is&k=20&c=SbgiZ1RUCfHL_SxGahX3DcQp0alR_BA8Qae7iqIEUn4=", "/images/a16.jpg"],
      phone: "+91 65432 10990",
    },
    {
      id: 9,
      name: "Dress Den",
      rating: 4.8,
      price: "₹ 75,000 - 7,50000",
      location: "Delhi",
      images: ["https://media.istockphoto.com/id/2200844553/photo/newlywed-couple-holding-hands-on-white-background.jpg?s=2048x2048&w=is&k=20&c=WLBI95f_OxVVJgdVnVmDCwAMBVruaEvKSIcaYfgn9Io=","/images/a17.jpg","https://media.istockphoto.com/id/2180166291/photo/groom-and-bride-with-bouquet-during-wedding-ceremony-close-up.jpg?s=2048x2048&w=is&k=20&c=fb_EhRr0gPLrshs-lNfvDdl0nc0hZb0jzVpGJUSWnLU=","https://media.istockphoto.com/id/2149961550/photo/stunning-indian-bride-dressed-in-traditional-bridal-lehenga-with-heavy-gold-jewellery-and.jpg?s=2048x2048&w=is&k=20&c=6n_HSGXdRQ44dO6l596MQghiIDyBN8WqTkfE9geQU70=", "/images/a8.jpg"],
      phone: "+91 98765 43213",
    },
    
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <FaArrowRight />,
    prevArrow: <FaArrowLeft />,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };



// === Main Component ===
const ModernEventPlanner = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);

  const photographers = [
    {
      className:"arrow-button",
      id: 1,
      name: "Riya Photographer",
      rating: 4.8,
      price: "₹28,000",
      //location: "Delhi",
      images: [
       // "images/p1.jpg",
       "images/photographer1.jpg",
        "images/photographer7.jpg",
        // "images/p2.jpg",
        // "images/p4.jpg",
      ],
      phone: "+91 98765 43210",
    },
    {
      id: 2,
      name: "Rajesh Photographer",
      rating: 4.9,
      price: "₹35,000",
     // location: "Mumbai",
      images: [
        // "images/photographer1.jpg",
        // "images/photographer2.jpg",
        // "images/photographer3.jpg",
        // "images/photographer1.jpg",
        // "images/photographer7.jpg",
        "images/p2.jpg",
        "images/p4.jpg",
      ],
      phone: "+91 87654 32109",
    },
    
  ];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch("https://eventmate-production-b589.up.railway.app/api/halls");
        if (!response.ok) throw new Error("Failed to fetch venue data");
        const data = await response.json();

        const formatted = data.map((hall) => ({
          id: hall.hallId,
          name: hall.hallName,
          img: hall.imageLink,
          location: hall.location,
        }));

        setVenues(formatted);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="page">
      {/* Header */}
      <header className="Modernheader">
        <div className="overlay"></div>
        <div className="header-content">
          <h1 style={{fontSize:60}}>Modern style meets classic charm</h1>
          <p>
            For those who envision perfection in every element. Discover our
            curated vendors dedicated to crafting flawless, customized event
            experiences.
          </p>
        </div>
      </header>

      <main className="container">
        {/* Venues Section */}
        <section className="section venues-section">
          <h2>Venues with Impeccable Service</h2>
          {venues.length === 0 ? (
            <p className="loading-text">Loading halls...</p>
          ) : (
            <div className="grid grid-5">
              {venues
                .filter((_, index) => [2, 9, 18, 34, 35].includes(index)) 
                // .filter((_, index) => [3, 10, 19, 30, 32].includes(index)) 

                .map((venue, i) => (
                  <div
                    key={i}
                    className="venue-card"
                    style={{ backgroundImage: `url(${venue.img})` }}
                  >
                    <div className="venue-overlay"></div>
                    <div className="venue-footer">
                      <div className="venue-info">
                        <h3>{venue.name}</h3>
                        <p className="venue-location">{venue.location}</p>
                      </div>
                      <button
                        className="button light small"
                        onClick={() => navigate(`/venue/${venue.id}`)}
                      >
                        Check Availability
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
        <hr className="divider" />
        
        {/* Expert Planners Section */}
<section className="section">
  <h2 style={{ textAlign: "center", marginBottom: 20 }}>
    Expert Planners & Vision Designers
    
  </h2>  
  <div
  style={{
    padding: "40px 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    maxWidth: 800,
    margin: "0 auto",
  }}
>
  {planners.map((service) => (
    <div  key={service.id}>
      <ServiceCard service={service} />
    </div>
  ))}
</div>

  
        </section>
        {/* Photographer Section */}
        <section className="section">
          <h2>Professional Photographers for Every Occasion</h2>
          <p style={{ color: "#6b7280", marginBottom: 32 }}>
            Explore professional photographers available for your events.
          </p>
          <div
     style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
        justifyContent: "center", 
        alignItems: "center",     
        maxWidth: 800,            
        margin: "0 auto",          
  }}
          >
            {photographers.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section> 
        <hr className="divider" /> 

      
           {/* Cake Section */}
           <section className="section">
          <h2>🍰 Delicious Cakes for Your Celebrations</h2>
          <p style={{ color: "#6b7280", marginBottom: 32 }}>
            Order customized cakes for your special occasions — contact directly
            to discuss your design and flavor preferences.
          </p>
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
    justifyContent: "center",   
    alignItems: "center",      
    maxWidth: 1200,             
    margin: "0 auto",           
    padding: "40px 24px",       
  }}
          >
            {cakes.map((service) => (
              <CakeCard key={service.id} service={service} />
            ))}
          </div>
        </section>


        {/* Bridal & Groom Attires Section */}
      
<section className="section">
  <h2>Bridal & Groom Attires</h2>
  <Slider {...sliderSettings}>
     {attires.map((item) => (
      <div key={item.id} className="attire-slide">
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: 16,
            margin: 10,
          }}
        >
          <img
            src={item.images[0]}
            alt={item.name}
            style={{
              width: "100%",
              height: 250,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 10,
            }}
          />
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>{item.name}</h3>
          <p style={{ margin: "4px 0", color: "#555" }}>{item.location}</p>
          <p style={{ color: "#059669", fontWeight: 600 }}>{item.price}</p>

          {/* ✅ Fixed: use item instead of attire */}
          <a
            href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#25D366",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            Enquiry  
          </a>
        </div>
      </div>
    ))}
  </Slider>
</section>
      </main>
    </div>
  );
};

export default ModernEventPlanner;

