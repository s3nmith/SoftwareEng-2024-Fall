package utils

import (
	"math/rand/v2"
	"strconv"
)

func GenerateRandomNDigits(n int) string {
	rnd := rand.New(rand.NewPCG(rand.Uint64(), rand.Uint64()))

	result := ""
	for i := 0; i < n; i++ {
		randn := rnd.IntN(10)
		result += strconv.Itoa(randn)
	}

	return result

}
