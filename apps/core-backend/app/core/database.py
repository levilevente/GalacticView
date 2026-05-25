import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


DATABASE_PASSWORD = os.getenv("POSTGRESQL_PASSWORD")
DATABASE_USER = os.getenv("POSTGRESQL_USER")
DATABASE_HOST = os.getenv("POSTGRESQL_HOST")

DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}/galacticview"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()