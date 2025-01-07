# Run this script to initialize the database
from app import app, db, CoffeeBean

# Sample data to populate the database
sample_beans = [
    {"name": "Columbia"},
    {"name": "Etheopia"},
]

with app.app_context():
    db.create_all()

    # # Clean up the coffee beans table
    # CoffeeBean.query.delete()
    # db.session.commit()

    # Add sample entries
    for bean_data in sample_beans:
        bean = db.session.query(CoffeeBean).filter_by(name=bean_data["name"]).first()
        if not bean:
            bean = CoffeeBean(name=bean_data["name"])
            db.session.add(bean)

    # Commit the changes to the database
    db.session.commit()
    print("Database initialized with sample entries!")
