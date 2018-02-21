/* eslint-disable */

/** 
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

const Matrix2 = function(opt_src) {
    let i, s, d;
    if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
        s = opt_src.elements;
        d = new Float32Array(4);
        for (i = 0; i < 4; ++i) {
            d[i] = s[i];
        }
        this.elements = d;
    } else {
        this.elements = new Float32Array([1, 0, 0, 1]);
    }
};

Matrix2.prototype.set = function(src) {
    let i, s, d;

    s = src;
    d = this.elements;

    if (s === d) {
        return;
    }
    
    for (i = 0; i < 4; ++i) {
        d[i] = s[i];
    }

    return this;
};

/**
 * Constructor of Matrix3
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
const Matrix3 = function(opt_src) {
    let i, s, d;
    if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
        s = opt_src.elements;
        d = new Float32Array(9);
        for (i = 0; i < 9; ++i) {
            d[i] = s[i];
        }
        this.elements = d;
    } else {
        this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }
};

Matrix3.prototype.set = function(src) {
    let i, s, d;

    s = src;
    d = this.elements;

    if (s === d) {
        return;
    }
    
    for (i = 0; i < 9; ++i) {
        d[i] = s[i];
    }

    return this;
};

Matrix3.prototype.normalFromMat4 = function(a) {
    const e = this.elements;
    a = a.elements;
    
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    e[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    e[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    e[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    e[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    e[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    e[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    e[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    e[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    e[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return this;
};

/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
const Matrix4 = function(opt_src) {
    let i, s, d;
    if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
        s = opt_src.elements;
        d = new Float32Array(16);
        for (i = 0; i < 16; ++i) {
            d[i] = s[i];
        }
        this.elements = d;
    } else {
        this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
};

/**
 * Copy matrix.
 * @param src source matrix
 * @return this
 */
Matrix4.prototype.set = function(src) {
    let i, s, d;

    s = src;
    d = this.elements;

    if (s === d) {
        return;
    }
    
    for (i = 0; i < 16; ++i) {
        d[i] = s[i];
    }

    return this;
};

/**
 * Multiply the matrix from the right.
 * @param other The multiply matrix
 * @return this
 */
Matrix4.prototype.concat = function(other) {
    let i, e, a, b, ai0, ai1, ai2, ai3;
  
    // Calculate e = a * b
    e = this.elements;
    a = this.elements;
    b = other.elements;
  
    // If e equals b, copy b to temporary matrix.
    if (e === b) {
        b = new Float32Array(16);
        for (i = 0; i < 16; ++i) {
            b[i] = e[i];
        }
    }
  
    for (i = 0; i < 4; i++) {
        ai0 = a[i]; ai1 = a[i + 4]; ai2 = a[i + 8]; ai3 = a[i + 12];
        e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
        e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
        e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
        e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
  
    return this;
};
Matrix4.prototype.multiply = Matrix4.prototype.concat;

/**
 * Calculate the inverse matrix of specified matrix, and set to this.
 * @param other The source matrix
 * @return this
 */
Matrix4.prototype.setInverseOf = function(other) {
    let i, s, d, inv, det;

    s = other.elements;
    d = this.elements;
    inv = new Float32Array(16);

    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
            + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
    inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
            - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
            + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
    inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
            - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

    inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
            - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
            + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
    inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
            - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
            + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
            + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
    inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
            - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
            + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
    inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
            - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

    inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
            - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
            + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
    inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
            - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
            + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

    det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
    if (det === 0) {
        return this;
    }

    det = 1 / det;
    for (i = 0; i < 16; i++) {
        d[i] = inv[i] * det;
    }

    return this;
};

/**
 * Calculate the inverse matrix of this, and set to this.
 * @return this
 */
Matrix4.prototype.invert = function() {
    return this.setInverseOf(this);
};

/**
 * Set the orthographic projection matrix.
 * @param left The coordinate of the left of clipping plane.
 * @param right The coordinate of the right of clipping plane.
 * @param bottom The coordinate of the bottom of clipping plane.
 * @param top The coordinate of the top top clipping plane.
 * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @return this
 */
Matrix4.prototype.setOrtho = function(r, t, near, far) {
    let e, rw, rh, rd;

    rw = 1 / r;
    rh = 1 / t;
    rd = 2 / (near - far);

    e = this.elements;

    e[0] = rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = rd;
    e[11] = (far + near) / (near - far);

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    return this;
};

/**
 * Multiply the orthographic projection matrix from the right.
 * @param left The coordinate of the left of clipping plane.
 * @param right The coordinate of the right of clipping plane.
 * @param bottom The coordinate of the bottom of clipping plane.
 * @param top The coordinate of the top top clipping plane.
 * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @return this
 */
Matrix4.prototype.ortho = function(left, right, bottom, top, near, far) {
    return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
};

/**
 * Set the perspective projection matrix by fovy and aspect.
 * @param fovy The angle between the upper and lower sides of the frustum.
 * @param aspect The aspect ratio of the frustum. (width/height)
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.setPerspective = function(fovy, aspect, near, far) {
    let e, rd, s, ct;

    if (near === far || aspect === 0) {
        throw 'null frustum';
    }
    if (near <= 0) {
        throw 'near <= 0';
    }
    if (far <= 0) {
        throw 'far <= 0';
    }

    fovy = Math.PI * fovy / 180 / 2;
    s = Math.sin(fovy);
    if (s === 0) {
        throw 'null frustum';
    }

    rd = 1 / (far - near);
    ct = Math.cos(fovy) / s;

    e = this.elements;

    e[0] = ct / aspect;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = ct;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -(far + near) * rd;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    return this;
};

/**
 * Multiply the perspective projection matrix from the right.
 * @param fovy The angle between the upper and lower sides of the frustum.
 * @param aspect The aspect ratio of the frustum. (width/height)
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.perspective = function(fovy, aspect, near, far) {
    return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
};

/**
 * Multiply the four-dimensional vector.
 * @param pos  The multiply vector
 * @return The result of multiplication(Float32Array)
 */
Matrix4.prototype.multiplyVector4 = function(pos) {
    const e = this.elements;
    const p = pos.elements;
    const v = new Vector4();
    const result = v.elements;

    result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[ 8] + p[3] * e[12];
    result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[ 9] + p[3] * e[13];
    result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
    result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

    return v;
};

/**
 * Multiply the matrix for scaling from the right.
 * @param x The scale factor along the X axis
 * @param y The scale factor along the Y axis
 * @param z The scale factor along the Z axis
 * @return this
 */
Matrix4.prototype.scale = function(x, y, z) {
    const e = this.elements;
    e[0] *= x; e[4] *= y; e[8] *= z;
    e[1] *= x; e[5] *= y; e[9] *= z;
    e[2] *= x; e[6] *= y; e[10] *= z;
    e[3] *= x; e[7] *= y; e[11] *= z;
    return this;
};

/**
 * Set the matrix for translation.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.setTranslate = function(x, y, z) {
    const e = this.elements;
    e[12] = x;
    e[13] = y;
    e[14] = z;
    e[15] = 1;
    return this;
};

/**
 * Multiply the matrix for translation from the right.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.translate = function(x, y, z) {
    const e = this.elements;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
};

Matrix4.prototype.getMaxScaleOnAxis = function() {

    const te = this.elements;

    const scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
    const scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
    const scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

    return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

};

Matrix4.prototype.makeRotationFromQuaternion = function( q ) {
    const te = this.elements;

    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x, y2 = y + y, z2 = z + z;
    let xx = x * x2, xy = x * y2, xz = x * z2;
    let yy = y * y2, yz = y * z2, zz = z * z2;
    let wx = w * x2, wy = w * y2, wz = w * z2;

    te[ 0 ] = 1 - ( yy + zz );
    te[ 4 ] = xy - wz;
    te[ 8 ] = xz + wy;

    te[ 1 ] = xy + wz;
    te[ 5 ] = 1 - ( xx + zz );
    te[ 9 ] = yz - wx;

    te[ 2 ] = xz - wy;
    te[ 6 ] = yz + wx;
    te[ 10 ] = 1 - ( xx + yy );

    return this;
};

Matrix4.prototype.transpose = function() {
    var e, t;

    e = this.elements;

    t = e[ 1];  e[ 1] = e[ 4];  e[ 4] = t;
    t = e[ 2];  e[ 2] = e[ 8];  e[ 8] = t;
    t = e[ 3];  e[ 3] = e[12];  e[12] = t;
    t = e[ 6];  e[ 6] = e[ 9];  e[ 9] = t;
    t = e[ 7];  e[ 7] = e[13];  e[13] = t;
    t = e[11];  e[11] = e[14];  e[14] = t;

    return this;
};

/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
const Vector3 = function(opt_src) {
    const v = new Float32Array(3);
    if (opt_src && typeof opt_src === 'object') {
        v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2];
    } 
    this.elements = v;
};

Vector3.angle = function(a, b) {
    const tempA = new Vector3(a.elements);
    const tempB = new Vector3(b.elements);
 
    tempA.normalize();
    tempB.normalize();
 
    const cosine = Vector3.dot(tempA, tempB);

    if (cosine > 1.0) {
        return 0;
    } else {
        return Math.acos(cosine);
    }     
};

Vector3.cross = function(a, b) {
    a = a.elements;
    b = b.elements;
    let ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    const out = new Vector3();
    out.elements[0] = ay * bz - az * by;
    out.elements[1] = az * bx - ax * bz;
    out.elements[2] = ax * by - ay * bx;
    return out;
};

Vector3.dot = function(a, b) {
    a = a.elements;
    b = b.elements;
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

Vector3.prototype.applyQuaternion = function ( q ) {

    var x = this.elements[0], y = this.elements[1], z = this.elements[2];
    var qx = q.elements[0], qy = q.elements[1], qz = q.elements[2], qw = q.elements[3];

    // calculate quat * vector

    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = - qx * x - qy * y - qz * z;

    // calculate result * inverse quat

    this.elements[0] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    this.elements[1] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    this.elements[2] = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;

}

/**
  * Normalize.
  * @return this
  */
Vector3.prototype.normalize = function() {
    const v = this.elements;
    let c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
    if (g) {
        if (g == 1) {
            return this;
        }
    } else {
        v[0] = 0; v[1] = 0; v[2] = 0;
        return this;
    }
    g = 1 / g;
    v[0] = c * g; v[1] = d * g; v[2] = e * g;
    return this;
};

/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
Vector3.prototype.add = function(b) {
    const a = this.elements;
    b = b.elements;
    a[0] = a[0] + b[0];
    a[1] = a[1] + b[1];
    a[2] = a[2] + b[2];
    return this;
};

Vector3.prototype.addS = function(b) {
    const a = this.elements;
    a[0] = a[0] + b;
    a[1] = a[1] + b;
    a[2] = a[2] + b;
    return this;
};

Vector3.prototype.scale = function(b) {
    const a = this.elements;
    a[0] = a[0] * b;
    a[1] = a[1] * b;
    a[2] = a[2] * b;
    return this;
};

Vector3.prototype.distanceToSquared = function( x, y, z ) {

    let dx = this.elements[0] - x, dy = this.elements[1] - y, dz = this.elements[2] - z;

    return dx * dx + dy * dy + dz * dz;

};

Vector3.prototype.subtract = function(b) {
    const out = this.elements;
    b = b.elements;
    out[0] = out[0] - b[0];
    out[1] = out[1] - b[1];
    out[2] = out[2] - b[2];
    return this;
};


/**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
var Vector4 = function(opt_src) {
    const v = new Float32Array(4);
    if (opt_src && typeof opt_src === 'object') {
        v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2]; v[3] = opt_src[3];
    } 
    this.elements = v;
};

Vector4.prototype.set = function(e) {
    const a = this.elements;
    a[0] = e[0];
    a[1] = e[1];
    a[2] = e[2];
    a[3] = e[3];
    return this;
};

Vector4.prototype.add = function(b) {
    const a = this.elements;
    b = b.elements;
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = a[3] + b[3];
    return this;
};

Vector4.prototype.normalize = function() {
    let x = this.elements[0],
        y = this.elements[1],
        z = this.elements[2],
        w = this.elements[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        this.elements[0] = x * len;
        this.elements[1] = y * len;
        this.elements[2] = z * len;
        this.elements[3] = w * len;
    }
    return this;
};

Vector3.prototype.divideScalar = function( scalar ) {
    return this.scale( 1 / scalar );
};

Vector3.prototype.applyMatrix4 = function( m ) {

    let x = this.elements[0], y = this.elements[1], z = this.elements[2];
    const e = m.elements;

    this.elements[0] = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ];
    this.elements[1] = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ];
    this.elements[2] = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];
    const w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ];

    return this.divideScalar( w );

};

Vector4.prototype.lerp = function(a, b, t) {
    const out = this.elements;
    let ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return this;
};

Vector3.prototype.lerp = function(a, b, t) {
    const out = this.elements;
    let ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return this;
};

const Vector2 = function(opt_src) {
    const v = new Float32Array(2);
    if (opt_src && typeof opt_src === 'object') {
        v[0] = opt_src[0]; v[1] = opt_src[1];
    } 
    this.elements = v;
};

Vector2.prototype.lerp = function(a, b, t) {
    const out = this.elements;
    let ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return this;
};

function Frustum( m ) {
    const planes = [new Vector4, new Vector4, new Vector4, new Vector4, new Vector4, new Vector4];
    const me = m.elements;
    let me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
    let me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
    let me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
    let me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

    planes[ 0 ].set( [me3 - me0, me7 - me4, me11 - me8, me15 - me12] ).normalize();
    planes[ 1 ].set( [me3 + me0, me7 + me4, me11 + me8, me15 + me12] ).normalize();
    planes[ 2 ].set( [me3 + me1, me7 + me5, me11 + me9, me15 + me13] ).normalize();
    planes[ 3 ].set( [me3 - me1, me7 - me5, me11 - me9, me15 - me13] ).normalize();
    planes[ 4 ].set( [me3 - me2, me7 - me6, me11 - me10, me15 - me14] ).normalize();
    planes[ 5 ].set( [me3 + me2, me7 + me6, me11 + me10, me15 + me14] ).normalize();

    return planes;
}

export { Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4, Frustum };
