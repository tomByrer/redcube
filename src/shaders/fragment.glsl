#version 300 es
precision highp float;

in vec2 outUV;
in vec3 outPosition;
#ifdef TANGENT
in mat3 outTBN;
#else
in vec3 outNormal;
#endif

out vec4 color;

uniform Material {
	vec4 baseColorFactor;
	vec3 lightPos;
	vec3 viewPos;
};
uniform sampler2D baseColorTexture;
uniform sampler2D metallicRoughnessTexture;
uniform sampler2D normalTexture;
uniform sampler2D occlusionTexture;

const float ambientStrength = 0.1;
const float specularStrength = 0.5;
const float specularPower = 32.0;
const vec3 lightColor = vec3(1.0, 1.0, 1.0);
const float occlusionStrength = 0.5;

void main() {
	#ifdef BASECOLORTEXTURE
	    vec4 baseColor = texture(baseColorTexture, outUV);
	#else
	    vec4 baseColor = baseColorFactor;
	#endif

	#ifdef METALROUGHNESSMAP
	    baseColor *= 1.0 - texture(metallicRoughnessTexture, outUV).b;
	#endif

	#ifdef HAS_OCCLUSIONMAP
	    float ao = texture(occlusionTexture, outUV).r;
	    baseColor = mix(baseColor, baseColor * ao, occlusionStrength);
	#endif

	#ifdef NORMALMAP
    	vec3 n = texture(normalTexture, outUV).rgb;
    	n = normalize(outTBN * (2.0 * n - 1.0));
	#else
	    #ifdef TANGENT
		vec3 n = outTBN[2].xyz;
		#else
		vec3 n = outNormal;
		#endif
	#endif

    vec3 ambient = ambientStrength * lightColor;

	vec3 lightDir = normalize(lightPos - outPosition);
	float diff = max(dot(n, lightDir), 0.0);
	vec3 diffuse = diff * lightColor;

	vec3 viewDir = normalize(viewPos - outPosition);
	vec3 reflectDir = reflect(-lightDir, n);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
	vec3 specular = specularStrength * spec * lightColor;

    color = vec4(baseColor.rgb * (ambient + diffuse + specular), 1.0);
}