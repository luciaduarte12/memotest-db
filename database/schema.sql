CREATE DATABASE MemotestDB;
GO

USE MemotestDB;
GO

-- Tabla de tecnologias: el contenido de las cartas
CREATE TABLE Tecnologias (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    logo_url VARCHAR(255) NOT NULL
);
GO

-- Tabla de partidas: cada fila es una partida completada
CREATE TABLE Partidas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tiempo_segundos INT NOT NULL,
    intentos INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Datos iniciales: las 6 tecnologias del stack
INSERT INTO Tecnologias (nombre, logo_url) VALUES
('React', 'react'),
('SQL Server', 'sqlserver'),
('Vite', 'vite'),
('Express', 'express'),
('Power BI', 'powerbi'),
('Git', 'git');
GO