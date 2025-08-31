import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // First verify JWT signature and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token exists in database and is not revoked
    const dbToken = await prisma.jwtToken.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            organizations: {
              include: {
                organization: true
              }
            }
          }
        }
      }
    });

    if (!dbToken) {
      return res.status(401).json({ error: 'Invalid token. Token not found.' });
    }

    if (dbToken.isRevoked) {
      return res.status(401).json({ error: 'Token has been revoked.' });
    }

    if (dbToken.expiresAt < new Date()) {
      // Mark token as expired in database
      await prisma.jwtToken.update({
        where: { id: dbToken.id },
        data: { isRevoked: true }
      });
      return res.status(401).json({ error: 'Token has expired.' });
    }

    if (!dbToken.user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // Update last used timestamp
    await prisma.jwtToken.update({
      where: { id: dbToken.id },
      data: { lastUsedAt: new Date() }
    });

    req.user = dbToken.user;
    req.userId = dbToken.user.id;
    req.tokenId = dbToken.id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token format.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Token validation failed.' });
  }
};

export const requireOrganization = async (req, res, next) => {
  try {
    const organizationId = req.header('X-Organization-ID');
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required in X-Organization-ID header.' });
    }

    const userOrg = req.user.organizations.find(
      uo => uo.organizationId === organizationId
    );

    if (!userOrg) {
      return res.status(403).json({ error: 'Access denied to this organization.' });
    }

    req.organizationId = organizationId;
    req.userRole = userOrg.role;
    req.organization = userOrg.organization;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
};

export const requireSuperAdmin = (req, res, next) => {
  if (!req.user.email.endsWith('@abetworks.in')) {
    return res.status(403).json({ error: 'Super admin access required.' });
  }
  next();
};