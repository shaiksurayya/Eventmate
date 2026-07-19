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
    id: 1,
    name: "Sweet Delights Bakery",
    rating: 4.9,
    price: "₹ 2,000 - 4,000 per 2 kg",
    location: "Pune",
    images: [
      "/images/c1.jpg",
      "/images/c2.jpeg",
      "/images/c3.jpg",
      "https://images.pexels.com/photos/9405268/pexels-photo-9405268.jpeg",
    ],
    phone: "+919876544321",
  },
  {
    id: 2,
    name: "Cake Avenue",
    rating: 4.8,
    price: "₹ 1,800 - 3,000 per 2 kg",
    location: "Bangalore",
    images: [
      "https://media.istockphoto.com/id/1865717652/photo/luxurious-desert-table-with-cake-cookies-and-cupcakes-set-up-at-a-wedding.jpg?s=1024x1024&w=is&k=20&c=Kj7AaGPXaBA0yfk_fBK5SK4hLXq3a6LHB88ob_ZkjZw=",
      "/images/cake2.jpg",
      "/images/cake3.webp",
    ],
    phone: "+918765433210",
  },
  {
    id: 3,
    name: "Sugar Bliss",
    rating: 4.7,
    price: "₹ 2,200 - 3,500 per 2 kg",
    location: "Chennai",
    images: [
      "https://media.istockphoto.com/id/1344455840/photo/photography-of-various-cakes-for-wedding-decorations-and-marriage-concept-recipes-and-food.jpg?s=2048x2048&w=is&k=20&c=QpwiIaNAWGYaR4mpOcosEPA_aUdOWounm3dViimFUJU=",
      "/images/cake4.jpg",
      "/images/cake5.jpg",
    ],
    phone: "+919123477654",
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
    id: 1,
    name: "Priya Singh",
    rating: 4.9,
    price: "₹35,000",
    //location: "Hyderabad",
    //image: "images/photo1.jpg",
       // image: "https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg", 
           image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", 


    // image : "https://raw.githubusercontent.com/Saurabh-devs/Event/c39058fe872d62b7a9bf3e6f690863bcfdec4481/public/images/photo1.png",
    // image : "https://raw.githubusercontent.com/Saurabh-devs/Event/c39058fe872d62b7a9bf3e6f690863bcfdec4481/public/images/1.png",
    call: "+91 91234 56780",
    whatsapp: "+91 98765 43210",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    rating: 4.7,
    price: "₹30,000",
    //location: "Bangalore",
    //image: "images/photo2.jpg",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    call: "+91 90123 45678",
    whatsapp: "+91 99887 66554",
  },
];

const attires = [
    
  {
    id: 1,
    name: "Bridal Couture House",
    rating: 4.8,
    price: "₹ 1,75000 - 10,00000",
    location: "Pune",
    images: ["https://media.istockphoto.com/id/2148525120/photo/indian-newlywed-couple-performing-havan-ritual-together-with-priests-guidance.jpg?s=2048x2048&w=is&k=20&c=7YxdOLYumwHZ8O4w33lxO1PW4PUp3JTcifKKizAMNG0=","/images/a1.jpg","https://media.istockphoto.com/id/1174403060/photo/man-in-a-suit-correcting-his-bow-tie-morning-preparation-groom-at-home-fashion-photo-of-a-man.jpg?s=2048x2048&w=is&k=20&c=p__xfRlJLiR2ybAY9r4QRcE5GEogqmYNZXApbocU7Lk=","https://media.istockphoto.com/id/2200850366/photo/beautiful-bride-in-red-traditional-clothing-at-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=j90F9U4JqaGjNItUuw09xcDKUjyUG2sd7iI-ozjOHUs=", "/images/a2.jpg"],
    phone: "+91 98765 43213",
  },
  // {
  //   id: 2,
  //   name: "Designer Wedding Wear",
  //   rating: 4.9,
  //   price: "₹ 1,20,000 - 11,00000",
  //   location: "Mumbai",
  //   images: ["https://media.istockphoto.com/id/2199983544/photo/happy-bride-showing-bangles-to-groom-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=9GI94g642IHBXeRq4UGH5GUPud-dtQOwEzV-Xn57fuU=","/images/a3.webp","https://media.istockphoto.com/id/995628538/photo/many-luxury-wedding-dresses.jpg?s=2048x2048&w=is&k=20&c=0CnRY6r2c_0hZTRKOSwVM-b01DPQikxXte9xGXiRIME=","https://media.istockphoto.com/id/960630682/photo/happy-portrait-handsome-groom-in-a-wedding-suit-with-boutonniere-standing-near-the-window.jpg?s=2048x2048&w=is&k=20&c=KUI6RKYD7BThQevpxAIkdXQI9GIjt4xWWVB9GybC7nU=","https://media.istockphoto.com/id/2175977154/photo/indian-bride-in-traditional-red-bridal-attire-with-intricate-embroidery-and-gold-jewelry.jpg?s=1024x1024&w=is&k=20&c=HjNCu8dFBlvSbrPv1mHOtl2cAyFnSQjPdJUcmFgH3_8=", "/images/a4.webp"],
  //   phone: "+91 87654 32112",
  // },
  // {
  //   id: 3,
  //   name: "Elegant Bridal Studio",
  //   rating: 4.7,
  //   price: "₹ 90,000 - 9,00000",
  //   location: "Bangalore",
  //   images: ["https://media.istockphoto.com/id/2200854698/photo/loving-groom-and-bride-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=hCiJomIzW2rcrvoyZEyfAvujZ_S4BFqboKx7cunsXxw=","/images/a2.jpg","https://media.istockphoto.com/id/1225025762/photo/wedding-dress-hanging-on-hangers.jpg?s=2048x2048&w=is&k=20&c=rkyEmvM8Tpxa-UiZMiYMPMcM--emntiZaO5uibXe4VQ=","https://media.istockphoto.com/id/1497656063/photo/portrait-of-a-groom-in-a-gray-plaid-suit-with-a-tie-in-a-light-bar.jpg?s=2048x2048&w=is&k=20&c=tTqaHDSrsMbQIay7jBQjs7GmlM5WKI_6mOqz5q1huWU=","https://media.istockphoto.com/id/2149946701/photo/portrait-of-indian-bride-wearing-dupatta.jpg?s=2048x2048&w=is&k=20&c=GXoQdIgNnoCl4pfywOcdU7OXMf2eoYsurPVBxiT7oJc=" ,"/images/a1.jpg"],
  //   phone: "+91 76543 21101",
  // },
  // {
  //   id: 4,
  //   name: "Royal Wedding Attire",
  //   rating: 4.6,
  //   price: "₹ 2,50000 - 25,00000",
  //   location: "Lucknow",
  //   images: ["https://media.istockphoto.com/id/2200870359/photo/groom-in-traditional-clothing-looking-at-camera-at-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=bLQ0WtOq_SvPcecpuS7zCbEWmCs3ZRQ3xP01kWJmqS8=","https://media.istockphoto.com/id/2165930380/photo/royalty.jpg?s=2048x2048&w=is&k=20&c=1ZIpm1HKBcdb7b0COfcxYZ8mZKz3H9beNHehR8IM0Uw=","https://media.istockphoto.com/id/2200850333/photo/bride-with-dupatta-on-head-looking-down-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=k_Smom1XAf6VqpvlrCzliVSmelpGLkuUd-by_9YzglE=","https://media.istockphoto.com/id/2242292561/photo/indian-brides-traditional-wedding-outfit-textile-fabric-and-pattern-close-up.jpg?s=2048x2048&w=is&k=20&c=NlCfcZbbzbXbQrrK8lQO-JcPZnFwGBTBhYmYeb_QMVA=","https://media.istockphoto.com/id/2187535521/photo/beautiful-smiling-indian-bride-in-traditional-bridal-lehenga-with-heavy-jewelry.jpg?s=2048x2048&w=is&k=20&c=Dj6U2c-N6_lRIm2A4mm5qU9KAufhDkxY65KEzpo2J84=" ,"https://media.istockphoto.com/id/2200637489/photo/happy-bride-and-groom-in-traditional-clothing-dancing-on-white-background.jpg?s=2048x2048&w=is&k=20&c=rfFSTBgeEoR73OWcSI5IYV5Abr8iDwIYs9B-UyeU1n8="],
  //   phone: "+91 65432 10990",
  // },
  // {
  //   id: 5,
  //   name: "Blissful Bride Boutique",
  //   rating: 4.8,
  //   price: "₹ 75,000 - 10,00000",
  //   location: "Delhi",
  //   images: ["https://media.istockphoto.com/id/155360190/photo/indian-bride-and-groom-outdoors.jpg?s=2048x2048&w=is&k=20&c=bVNgvl_lP9QFzmvLIvBA85OkdBaSMBl41wtCkkdHLHo=","/images/a4.jpg","https://media.istockphoto.com/id/1339458177/photo/white-beige-range-of-clothes-hangs-on-hangers-in-boutique.jpg?s=2048x2048&w=is&k=20&c=eR_epMlXPLSBEw7ag9VJIYMSwEsbkoPdob5oeKKV-OE=","https://media.istockphoto.com/id/1220547446/photo/elegant-groom-in-suit-businessman.jpg?s=2048x2048&w=is&k=20&c=hQh0nj3aQDwlEnxSSqq3GxZLVIUZd0_PgXI23fWfHPs=","https://media.istockphoto.com/id/1810851006/photo/indian-woman-adorned-in-traditional-lehenga-and-gold-jewelry-standing-with-her-hands-folded.jpg?s=2048x2048&w=is&k=20&c=H-gpkHYllXXXttSFd77PY8QpabKfmwq9lcRDQ9mBDLQ=" ,"/images/a2.jpg"],
  //   phone: "+91 98765 43213",
  // },
  // {
  //   id: 6,
  //   name: "Wedding Whispers",
  //   rating: 4.9,
  //   price: "₹ 1,20,000 - 9,50000",
  //   location: "Mumbai",
  //   images: ["https://media.istockphoto.com/id/1225968488/photo/indian-rich-marriage-ceremony.jpg?s=2048x2048&w=is&k=20&c=lEQ2uwBXdGgOzsw6X556IO5ken4CGj-xoSto0oVs6AY=","/images/a15.jpg","https://media.istockphoto.com/id/1491876236/photo/shallow-depth-of-field-details-with-wedding-dresses-on-display-in-a-shop.jpg?s=2048x2048&w=is&k=20&c=WaNyyhZRzd9eHwrZ1E3PZmn1Q9Be_bpUy4qkfw42loc=","https://media.istockphoto.com/id/2112058221/photo/a-beautiful-young-bride-in-a-summer-park-is-walking-to-her-groom-photo-of-the-groom-in-the.jpg?s=1024x1024&w=is&k=20&c=dOuR_gauqAfheZMWBZvi7h32HeJCpUKPQKaHDcbTqCU=","https://media.istockphoto.com/id/1810850849/photo/stunning-indian-bride-dressed-in-traditional-red-bridal-lehenga-with-heavy-gold-jewellery-and.jpg?s=2048x2048&w=is&k=20&c=F8jjeA5F_KvjcaBB_nKMRiYt8aAlmyjh7c8hRbA79zU=", "/images/a5.jpg"],
  //   phone: "+91 87654 32112",
  // },
  
  {
    id: 10,
    name: "Veil & Vow",
    rating: 4.9,
    price: "₹ 1,20,000 - 10,00000",
    location: "Pune",
    images: ["https://media.istockphoto.com/id/1321755018/photo/attractive-happy-north-indian-couple-in-traditional-dress.jpg?s=1024x1024&w=is&k=20&c=29FdyvfiO3tLzy5RKU0Kxprl2C1lUu57CQEwARQEtrM=","/images/a18.jpg","https://media.istockphoto.com/id/1872497505/photo/the-groom-in-a-brown-suit-and-the-bride-in-a-white-dress.jpg?s=2048x2048&w=is&k=20&c=G_lyY8N3TCnsA3Ay4lar3xS7i6H9IiUvMYAamYd4kog=","https://media.istockphoto.com/id/1137566569/photo/beautiful-indian-girl-in-bride-look-wearing-red-lehanga-and-gold-jewellery.jpg?s=2048x2048&w=is&k=20&c=LQLrwIVXFBEFEeBjNFF2-Le2bBy7Hj8ilkVHPiKG_3c=", "/images/a9.jpg"],
    phone: "+91 87654 32112",
  },
  {
    id: 11,
    name: "Alexander McQueen and Givenchy",
    rating: 4.7,
    price: "₹ 2,90,000 - 19,00000",
    location: "Bangalore",
    images: ["https://media.istockphoto.com/id/484227639/photo/traditional-ladies-wear-saries-at-marketplace-madhya-pradesh.jpg?s=2048x2048&w=is&k=20&c=PXIM2RQPBVv9BtSAn-LV1WPUEbRytXwBpRf-Dnik_fU=","https://media.istockphoto.com/id/517465027/photo/traditional-ladies-wear-sarees.jpg?s=2048x2048&w=is&k=20&c=JmoXnSeQIy7eGPS-shJuvIq2f9NnO4PZ8gnCagh8kxg=","/images/a19.jpg","https://media.istockphoto.com/id/2235000516/photo/portrait-of-very-beautiful-young-indian-bride-in-luxurious-bridal-costume-with-makeup-and.jpg?s=2048x2048&w=is&k=20&c=S-DPa5cLlFKdLokIsoPMXF00b1iB6gqnS1Ffn51Qcf0=","https://media.istockphoto.com/id/2200874881/photo/loving-groom-looking-at-bride-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=NnZkm8DnV2igmuuMx1APvrY7z1HO1nKiog0ADQM7hQs=","https://media.istockphoto.com/id/2148524188/photo/indian-bride-and-groom-taking-a-happy-glance-of-each-other-as-they-take-circles-around-the.jpg?s=2048x2048&w=is&k=20&c=dL_osHpUhk-ndXDMUugI35PIXn7-TpmBXcT0udoAR-4=", "https://media.istockphoto.com/id/1432842171/photo/indian-groom-getting-ready-for-his-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=A6e1KkkbQMFTS3mXJK24PxTzedijI4dSgR13IKAAfpQ=","https://media.istockphoto.com/id/1478130654/photo/punjabi-culture.jpg?s=1024x1024&w=is&k=20&c=wYmaHTbTOZNulPI1HUGzMpNC7N6lJaekyQNLoGJeyOY="],
    phone: "+91 76543 21101",
  },
  // {
  //   id: 12,
  //   name: "Dream Dress",
  //   rating: 4.6,
  //   price: "₹ 85,000 - 9,50000",
  //   location: "Lucknow",
  //   images: ["https://media.istockphoto.com/id/937881602/photo/attractive-happy-south-indian-couple-in-traditional-dress.jpg?s=2048x2048&w=is&k=20&c=np00iM8uk_HlEHAxFj4Ws56vsW_B4UkvQasiA10LpZk=","/images/a20.jpg","https://media.istockphoto.com/id/1497671387/photo/newlyweds-walk-in-the-city-near-old-buildings.jpg?s=2048x2048&w=is&k=20&c=lr0AAVJPcojm1yoiUETWdL6dPAc6Lz07W6v1h8UWhxo=", "https://media.istockphoto.com/id/1213798493/photo/young-indian-woman-in-bridal-wear-jewelry-and-make-up.jpg?s=1024x1024&w=is&k=20&c=zzmA_v88zwVCxFn0lGG0OLpGYbtMe7PBAR4uSxtFw-8=","/images/a11.jpg"],
  //   phone: "+91 65432 10990",
  // },
  
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
const Planning = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);

  const photographers = [
    
    {
      id: 3,
      name: "Chandan Photographer",
      rating: 4.7,
      price: "₹30,000",
     // location: "Bangalore",
      images: [
        "images/photographer4.jpg",
        //"images/photographer5.jpg",
        "images/photographer6.jpg",
      ],
      phone: "+91 76543 21098",
    },
    {
      id: 4,
      name: "Aashutosh Photographer",
      rating: 4.9,
      price: "₹40,000",
     // location: "Lucknow",
      images: [
        // "images/photographer7.jpg",
       // "images/photographer3.jpg",
       // "images/p2.jpg",
        // "images/photographer1.jpg",
         "images/photographer2.jpg",
        "images/photographer3.jpg",
      ],
      phone: "+91 65432 10987",
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
      <header className="Planningheader">
        <div className="overlay"></div>
        <div className="header-content">
          <h1 style={{fontSize:60}}>Every Detail, Perfectly Planned</h1>
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
                .filter((_, index) => [3, 10, 19, 30, 32].includes(index))
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


        
        {/* Expert Planners */}
     
        {/* <section className="section">
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

  
        </section> */}

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

export default Planning;

