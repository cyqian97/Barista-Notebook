# Run this script to initialize the database
from app import app, db, CoffeeBean
from datetime import datetime

# Sample data to populate the database
sample_beans = [
    {
        "name": "Sudan Rume Natural",
        "country": "Rwanda",
        "region": "Valle del Cauca",
        "farm": "Cafe Granja La Esperanza’s Las Margaritas farm",
        "altitude": "1700 m",
        "process": "Natural",
        "variety": "Sudan Rume",
        "harvest_year": 2024,
        "harvest_month": 2,
        "last_use_date": datetime(2022, 12, 28, 23, 55, 59, 342380)
    },
    {
        "name": "Rwanda Kanzu",
        "country": "Rwanda",
        "process": "Washed",
        "roast": "Expressive Light",
        "variety": "Red Bourbon",
        "drying": "Raised-Bed Dried",
        "Roaster": "CR-35",
        "harvest_year": 2024,
        "harvest_month": 5,
        "last_use_date": datetime(2024, 12, 28, 23, 55, 59, 342380)
    },
]

with app.app_context():
    db.create_all()

    # Clean up the coffee beans table
    CoffeeBean.query.delete()
    db.session.commit()

    # Add sample entries
    for bean_data in sample_beans:
        bean = db.session.query(CoffeeBean).filter_by(
            name=bean_data["name"]).first()
        if not bean:
            bean = CoffeeBean(name=bean_data["name"],
                              country=bean_data["country"],
                              process=bean_data["process"],
                              roast=bean_data["roast"] if "roast" in bean_data else None,
                              region=bean_data["region"] if "region" in bean_data else None,
                              farm=bean_data["farm"] if "farm" in bean_data else None,
                              variety=bean_data["variety"] if "variety" in bean_data else None,
                              drying=bean_data["drying"] if "drying" in bean_data else None,
                              roaster=bean_data["roaster"] if "roaster" in bean_data else None,
                              harvest_year=bean_data["harvest_year"] if "harvest_year" in bean_data else None,
                              harvest_month=bean_data["harvest_month"] if "harvest_month" in bean_data else None,
                              note=bean_data["note"] if "note" in bean_data else None,
                              last_use_date=bean_data["last_use_date"] if "last_use_date" in bean_data else None)


            db.session.add(bean)

    # Commit the changes to the database
    db.session.commit()
    print("Database initialized with sample entries!")
