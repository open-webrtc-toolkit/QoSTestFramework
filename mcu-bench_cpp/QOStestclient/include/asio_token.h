//
//Intel License
//

#ifndef ASIO_TOKEN_H
#define ASIO_TOKEN_H
#include <string>
#include <functional>

// Method to fetch token before joining room
std::string getToken(const std::string& addr, const std::string& room_id, const std::string& isp, const std::string& region, bool verify_peer);

// Method to mix stream into mixed stream
void mix(const std::string& addr, const std::string& room_id, const std::string& pub_id);
#endif // __ASIO_TOKEN__H__
